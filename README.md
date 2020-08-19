# OpenTerm
OpenTerm allows you to run arbitrary commands from [_Independent Terminal Emulators_][VT] of target OS's and to **see the output**. It also provides configurable function which will automatically determine **Terminal** to run command from, depending on Target OS.

**Important:** Part of **seeing output** is crucial because in general terminals adhere to behavior of closing after command beeing executed, which not allow client to see the output.
## Table of Contest
- [Usage](#usage)
  - [VT](#part-1-vt)
  - [VTexec](#part-2-vtexec)
- [Supported Terminals](#supported-terminals)
- [Package Defaults](#package-defaults)
-------------------------

## Usage
This package consists of **2 parts**.
1. [Part 1 - **VT**](#part-1-vt) : Virtual Terminal runners list.
1. [Part 2 - **VTexec**](#part-2-vtexec) - Configurable function which automatically determines Terminal and runs.


### Part 1: VT
##### Table of Contest
- [Usage](#part-1-vt)
- [VT Functions Signiture](#vt-function-signiture)
- [Supported Terminals](#supported-terminals)
-------------------------

First Part exported as **"VT"** consists of distributed by platforms functions for running different Terminals. You can use them to run command in a separate Terminal:
1. Use Linux Terminals. e.g.
    ```javascript
    const { VT } = require('open-term')
    VT.linux.xterm('ls -l') // Runs "ls -l" command in xterm.
    VT.linux.guake('ls -l') // Runs "ls -l" command in guake.
    ```
2. Use Win32 Terminals. e.g.
    ```javascript
    const { VT } = require('open-term')
    VT.win32.cmd('help') // Runs "help" command in cmd.
    ```
When calling **VT** functions, as a result you getting [_ChildProcess_][ChildProcess] instance representing spawned terminal. If you want you can [_unref_][unref] it to allow current nodejs process to exit independently of the spawned terminal.


#### VT Function Signiture
All **VT** functions has same signiture named _TerminalExecutor_: 
```typescript
type TerminalExecutor = (command: string, terminalArgs?: string[], terminalSpawnOptions?: SpawnOptions) => ChildProcess
```
- **_command_** - Defines command string to execute in opened terminal.
- **_terminalArgs_** - Defines arguments to start terminal with. By default all terminals runed with 3 types of arguments each responsible for key behaviour of our package:
    - **execArg:Static** Argument responsible for command execution, which takes provided command, e.g `-e command` for "_guake_"
    - **holdArg:Optional**: Argument which force terminal to not be closed after command is executed. e.g. `-hold` for "_xterm_".
    > **NOTE:** Although this argument defines required behaviour for our package, **"terminals must not be closed after command executed"** - but in some cases, the terminal not provide arguments to control this behaviour, at the same time it behaves exactly as desired, so we stick with static and at same time desired behaviour. Good example is "_guake_".
    >
    > **Important:** Terminals that cannot achieve this behavior are not supported by package.
    - **PopupArgs:Optional**: This argument(s) force to open terminal in a new window, or at least in a new tab and show it immediately, e.g. `--show -n .` for "_guake_".
    > **NOTE:** If there is a way, terminal will be opened in a new window. If not, it will be opened in a new tab and shown. Good example is " _guake_", when theres no way to open a new window, but we can open a new tab, and show "_guake_" at startup.
    >
- **_terminalSpawnOptions_** - Options to spawn terminal process with two defaults:
    - **_detached_** - `true`
    - **_stdio_** - `'ignore'`

    For more details see [_SpawnOptions_][SpawnOptions].
    
    
If you provide any number of **"terminalArgs"** which not contain **_execArg_** for terminal, then all default arguments will be disabled except **_execArg_**, and provided list will be used. If you want to disable all default arguments including **_execArg_**, you must specify **_execArg_**.

You can find information about available arguments for particular terminal on its **man page** or in **help**.

#### Supported Terminals
Currently supported Terminal Emulators listed by Platforms:
1. linux
    - [x] xterm - `VT.linux.xterm`
    - [x] guake - `VT.linux.guake`
    - [x] konsole - `VT.linux.konsole`
    - [x] xfce4-terminal - `VT.linux.xfce`
2. windows
    - [x] cmd - `VT.win32.cmd`

You can of course easily extend this list if you want.
_________________________

### Part 2: VTexec
##### Table of Contest
- [Usage](#part-2-vtexec)
- [VTexec Function Signiture](#vtexec-function-signiture)
- [SearchConfig](#searchconfig)
- [Terminal Search Algorithm](#terminal-search-algorithm)
-------------------------

This function automatically determine terminal to use, open it, and execute provided command in it. Algorithm which define's how to find terminal, follow the configuration provided with second argument to **VTexec** function. If It's not provided, then, 
1. For supported **platforms** ( **See** [_PlatformsList_](#platformslist) ) default [_{{Platform}}SearchConfig_](#platformsearchconfig) will be used.
1. For not supported **platforms**, **VTexec** will iterate through [_PlatformsList_](#platformslist) and for each **platform** look in [_{{Platform}}TerminalsList_](#platformterminalslist) for terminal until found.
> See [Terminal Search Algorithm](#terminal-search-algorithm).

Well, example below will success both on **win32** and **linux**, and additionaly in any OS, if `env.PATH` contains at least one terminal from supported ones regardless of platform i.e. if your os platform is **blablabla**, but you have in your `$PATH` _guake_, then we will run it.
```javascript
const { VTexec } = require('open-term')
VTexec('help') // Runs "help" command.
```

You can force **VTexec** to not support particular **platform** by providing appropriate property on **VTexecConfig** with value `null`.
```javascript
const { VTexec } = require('open-term')
VTexec('help', {
    win32: null,
    openbsd: null
}) // Force to throw an error: 'NotSupported' for 'win32' and 'openbsd'.
```

Or, you can change default **searchConfig** values for supported **platforms**. For more ditails see [SearchConfig](#searchconfig).
> Configs for not supported **platforms**, if provided, will be ignored.
```javascript
const { VTexec } = require('open-term')
VTexec('help', {
    // This Config force to consider for linux only 'xterm' | 'guake' | 'konsole'
    // terminals, with provided order.
    // With only one difference, to consider 'konsole' first of all.
    linux: {
        priorityTerms: ['konsole'],
        terms: ['xterm', 'guake', 'konsole']
    },
    // Config for 'openbsd' will be ignored
    openbsd: {
        terms: ['openbsdTerm', 'else']
    }
}) // Force to throw an error: 'NotSupported' for 'win32' and 'openbsd'.
```

Here, as any **VT** Terminal function, it return's [_ChildProcess_][ChildProcess] instance. To be precise, it uses the same [_VT_](#part-1-vt) functions under the hood.


#### VTexec Function Signiture
```typescript
function VTexec(command: string, vtExecConfig: VTexecConfig): ChildProcess
```
- **_command_** - Defines command string to execute in found terminal.
- **vtExecConfig:Optional** - Is a `{ [key: {{platform}}]?:{{searchConfig | null}}, default?: Platform[] | null }` map with one reserved key - **"default"**, which cant be used as **platform** name.

  [SearchConfig](#searchconfig) if provided, will be considered only for supported platforms. Every supported platform has it's default **searchConfig** ( see [_{{Platform}}SearchConfig_](#platformsearchconfig) ). Platform's support can be manually disabled by setting appropriate platform property to `null`.
  
  Property **"default"**, instead of **searchConfig**, takes _Array_ of **platform** names from [_PlatformsList_](#platformslist), as fallbacks list to search terminal for not supported platforms unless that platform is not explicitly excluded. Fallbacks can be disabled by setting this property to `null`. If **"default"** is not provided, [_PlatformsList_](#platformslist) will be used.
    > vtExecConfig - default is empty object, i.e. Any internal properties will take their defaults.


#### SearchConfig

  - **_terms_** - Terminals list to look for when searching terminal to use. By default it takes **{{Platform}}TerminalsList** for appropriate **platform**.
  - **_excludeTerms_** - Terminals to exclude from **_SearchConfig.terms_**. By default is empty _Array_: `[]`.
  - **_priorityTerms_** - Priority Terminals to look for first, in same order as specified in list. By default it takes **{{Platform}}TerminalsList**.


#### Terminal Search Algorithm
When searching terminal to use, **VTexec** first of all look for your platform in **vtExecConfig** map, 
 - If it exists in map, then:
    1. If provided value is `null` it whill end with error: _NotSupported_.
    1. If **searchConfig** provided
        1. If your platform is supported then it will deduce from config a list of terminals, and iterate through until terminal found.
        1. If your platform is not supported it will fall to default.
        > See **"default"** below.
 - If it not exist:
    1. If your **platform** is supported one, then **{{Platform}}SearchConfig**,  which is default, will be used.
    1. If your **platform** is not supported one, the algorithm will look for **"default"** in provided **vtExecConfig**.
        1. If **default** is **null**, then it will end with error: _NotSupported_
        1. If **default** is list of **platforms**, then it will iterate through and watch for all terminals of each provided platform name which is supported until one is found.
        1. If **default** is not specified it will take as default **_PlatformsList_**.
_________________________

#### Package Defaults
#### PlatformsList
```javascript 
['linux', 'win32']
```

#### {{Platform}}SearchConfig
- linuxSearchConfig: 
    ```javascript
    {
    priorityTerms: ['xterm', 'guake', 'konsole', 'xfce'],
    terms: ['xterm', 'guake', 'konsole', 'xfce'],
    excludeTerms: [],
    }
    ```
- win32SearchConfig: 
    ```javascript
    {
    priorityTerms: ['cmd'],
    terms: ['cmd'],
    excludeTerms: [],
    }
    ```
#### {{Platform}}TerminalsList
- linuxTerminalsList: 
    ```javascript
    ['xterm', 'guake', 'konsole', 'xfce']
    ```
- win32TerminalsList: 
    ```javascript
    ['cmd']
    ```
        
Thats it.

[VT]: https://en.wikipedia.org/wiki/Terminal_emulator

[ChildProcess]: https://nodejs.org/api/child_process.html#child_process_class_childprocess
[unref]: https://nodejs.org/api/child_process.html#child_process_subprocess_unref
[SpawnOptions]: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options