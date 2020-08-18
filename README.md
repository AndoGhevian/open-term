# OpenTerm
OpenTerm allows you to run arbitrary commands from [**Independent Terminal Emulators**][VT] of target OS's and to **see the output**. It also provides configurable function which will automatically determine **Terminal** to run command from, depending on Target OS.

**Important:** Part of **seeing output** is crucial because in general terminals adhere to behavior of closing after command beeing executed, which not allow client to see the output.

## Usage
This package consists of **2 parts**.
1. Part 1 - **VT** : Virtual Terminal runners list.
1. Part 2 - **VTexec** - Configurable function which automatically determins Terminal and runns.

### Part 1: VT
First Part exported as **"VT"** consists of distributed by platforms functions for running different Terminals. You cant use them to run command in a separate Terminal:
1. Use Linux Terminals. e.g.
    ```javascript
    const { VT } = require('./open-term')
    VT.linux.xterm('ls -l') // Runs "ls -l" command in xterm.
    VT.linux.guake('ls -l') // Runs "ls -l" command in guake.
    ```
2. Use Win32 Terminals. e.g.
    ```javascript
    const { VT } = require('./open-term')
    VT.win32.cmd('help') // Runs "help" command in cmd.
    ```
When calling **VT** functions, as a result you getting [**ChildProcess**][ChildProcess] instance representing spawned terminal. If you want you can [_unref_][unref] it to allow current nodejs process to exit independently of the spawned terminal.

All **VT** functions has same signiture named _TerminalExecutor_: 
```typescript
TerminalExecutor = (command: string, terminalArgs?: string[], terminalSpawnOptions?: SpawnOptions) => ChildProcess
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
    If you provide any number of **_terminalArgs_** which not contain **"execArg"** for terminal, then all default arguments will be disabled except **"execArg"**, and provided list will be used. If you want to override all default arguments including **"execArg"**, you must specify **"execArg"**.
- **_terminalSpawnOptions_** - Options to spawn terminal process with two defaults:
    - **_detached_** - `true`,
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

### Part 2: VTexec


[VT]: https://en.wikipedia.org/wiki/Terminal_emulator

[ChildProcess]: https://nodejs.org/api/child_process.html#child_process_class_childprocess
[unref]: https://nodejs.org/api/child_process.html#child_process_subprocess_unref
[SpawnOptions]: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options