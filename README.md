# OpenTerm
OpenTerm allows you to run arbitrary commands from Independent [**Terminal Emulators**][VT] of target OS's. It also provides configurable function which will automatically determine **Terminal** to run command from, depending on Target OS. And one of the most useful features is that by default Terminal will not closed automaticaly after it finishe's command execution.

## Usage
This package consists of **2 parts**.
1. Part 1 - **VT**
1. Part 2 - **VTexec**

### Part 1
First Part exported as **"VT"** consists of distributed by platforms functions for running different Terminals. You cant use them to run command in a separate Terminal:
```javascript
const { VT } = require('./open-term')
VT.linux.xterm('ls -l') // Runs "ls -l" command in xterm.
VT.linux.guake('ls -l') // Runs "ls -l" command in guake.
```
Currently supported Terminal Emulators listed by Platforms:
1. linux
    - [x] xterm - `VT.linux.xterm`, 
    - [x] guake - `VT.linux.guake`, 
    - [x] konsole - `VT.linux.konsole`,
    - [x] xfce4-terminal - `VT.linux.xfce`,
2. windows
    - [x] cmd - `VT.win32.cmd`

You can of course easily extend this list if you want.



[VT]:[https://en.wikipedia.org/wiki/Terminal_emulator]