# OpenTerm
OpenTerm allows you to run arbitrary commands from [**Independent Terminal Emulators**][VT] of target OS's and to **see the output**. It also provides configurable function which will automatically determine **Terminal** to run command from, depending on Target OS.

**Important:** Part of **seeing output** is crucial because in general terminals adhere to behavior of closing after command beeing executed, which not allow client to see the output.

## Usage
This package consists of **2 parts**.
1. Part 1 - **VT** : Virtual Terminal runners list.
1. Part 2 - **VTexec** - Configurable function which automatically determins Terminal and runns.
_________________________

### Part 1: VT
First Part exported as **"VT"** consists of distributed by platforms functions for running different Terminals. You cant use them to run command in a separate Terminal:
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
When calling **VT** functions, as a result you getting [**ChildProcess**][ChildProcess] instance representing spawned terminal. If you want you can [_unref_][unref] it to allow current nodejs process to exit independently of the spawned terminal.

All **VT** functions has same signiture named _TerminalExecutor_: 
```typescript
type TerminalExecutor = (command: string, terminalArgs?: string[], terminalSpawnOptions?: SpawnOptions) => ChildProcess
```
- **_command_** - Defines command string to execute in opened terminal.
- **_terminalArgs_** - Defines arguments to start terminal with. By default all terminals start with 3 types of arguments each responsable for key behaviour of our package: 
    - **execArg:Static** Argument responsable for command execution which takes provided command, e.g `-e command` for "_guake_"
    - **holdArg:Optional**: Argument which force terminal to not be closed after command is executed. e.g. `-hold` for "_xterm_".
    > Although this argument defines required behaviour for our package, **"terminals must not be closed after command executed"** - but in some cases terminal not provide arguments to control this behaviour but at same time it's default for terminal, so we stick with static and at same time desired behaviour. Good example is "_guake_".
    >
    > Terminals, for which theres not way to achieve this behaviour, are omited from the package.
    - **PopupArgs:Optional**: This arguments force to open terminal in new window, or at least in new tab and show it immediately.
    > If there is a way, terminal will be opened in new window. If not, it will be opened in new tab and showed. e.g." _guak_", when theres no way to open new window, but we can open new tab, and show _guake_ at startup.
    >
    If you provide any number of **_terminalArgs_** which not contain **"execArg"** for terminal, then all default arguments will be disabled except **"execArg"**, and provided list will be used. If you want to disable all default arguments including **"execArg"**, you must specify **"execArg"**.
- **_terminalSpawnOptions_** - Options to spawn terminal process with two defaults:
    - **_detached_** - `true`
    - **_stdio_** - `'ignore'`

    For more details see [**SpawnOptions**][SpawnOptions].
  
  You can find information about available arguments for particular terminal on its **man page** or in **help**.

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
This function automatically determine terminal to use, open it, and execute provided command in it. Algorithm which define's how to find terminal follow the configuration provided with second argument to **VTexec** function. If **config** is not provided, it will take **{{Platform}}SearchConfig** for supported **platforms**, or, if **platform** is not supported, it will iterate through **PlatformsList** and for each **platform** look in **{{Platform}}TerminalsList** for terminal until found.

Here, as any **VT** Terminal function, it return's [**ChildProcess**][ChildProcess] instance. To be precise, it uses the same **VT** functions under the hood.

Signiture of **VTexec**: 
```typescript
function VTexec(command: string, options?: VTexecOptions): ChildProcess
```
- **_command_** - Defines command string to execute in found terminal.
- **VTexecOptions:Optional** - Is a `{ [key: {{platform}}]?:{{searchConfig}}, default?: Platform[] }` map with one reserved key name - **"default"**. Every supported platform has it's default **searchConfig**. Key **"default"** instead of **searchConfig**, takes _Array_ of **platform** names from **PlatformsList**, as fallbacks list to search terminal in, if there is no config provided for platform in map.
    > VTexecOptions - default is empty object.
    > - For supported **platforms** see **_PlatformsList_**.
    > - For default **searchConfig** of each supported **platform** see **{{platform}}SearchConfig**.

**SearchConfig:**
  - **_terms_** - Terminals list to look for when searching terminal to use. By default it takes **{{Platform}}TerminalsList** for appropriate **platform**.
  - **_excludeTerms_** - Terminals to exclude from **_SearchConfig.terms_**. By default is empty _Array_: `[]`.
  - **_priorityTerms_** - Priority Terminals to look for first, in same order as specified in list. By default it takes **{{Platform}}TerminalsList**.

**Terminal Search Algorithm:**
When searching terminal to use, **VTexec** first of all look for your platform in **VTexecOptions** map, 
 - If it exists in map, then:
    1. If provided value is `null` it whill end with error: _NotSupported_.
    1. If **searchConfig** provided
        1. If your platform is supported then it will deduce from config a list of terminals, and iterate through until terminal found.
        1. If your platform is not supported it will fall to default.
        > See **"default"** below.
 - If it not exist:
    1. If your **platform** is supported one, then **{{Platform}}SearchConfig**,  which is default, will be used.
    1. If your **platform** is not supported one, the algorithm will look for **"default"** in provided **VTexecOptions**.
        1. If **default** is **null**, then it will end with error: _NotSupported_
        1. If **default** is list of **platforms**, then it will iterate through and watch for all terminals of each provided platform name which is supported until one is found.
        1. If **default** is not specified it will take as default **_PlatformsList_**.
_________________________

**Package Defaults:**
  - **PlatformsList**: 
    ```javascript 
    ['linux', 'win32']
    ```

  - **{{Platform}}SearchConfig:**
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
  - **{{Platform}}TerminalsList:**
    - linuxTerminalsList: 
        ```javascript
        ['xterm', 'guake', 'konsole', 'xfce']
        ```
    - win32TerminalsList: 
        ```javascript
        ['cmd']
        ```
        
Well, This will run both on **win32** and **linux**. And additionaly in different distros of linux, with different terminals included in `$PATH` it will work.
```javascript
const { VTexec } = require('open-term')
VTexec('help') // Runs "help" command.
```
Thats it.

[VT]: https://en.wikipedia.org/wiki/Terminal_emulator

[ChildProcess]: https://nodejs.org/api/child_process.html#child_process_class_childprocess
[unref]: https://nodejs.org/api/child_process.html#child_process_subprocess_unref
[SpawnOptions]: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options