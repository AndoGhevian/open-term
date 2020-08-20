import { SpawnOptions, ChildProcess } from 'child_process'
import VT from './VT'

/**Defines supported platforms. */
export type PlatformsList = (keyof typeof VT)

/**
 * Run command from Terminal.
 * @param command - String representation of command.
 * @param terminalArgs - Args to run terminal with. 
 * 
 * NOTE:  If any command execution arg provided for current terminal, it will replace  existing command.
 * @defaultValue `undefined` : Means run command with default arguments povided by package.
 * @param terminalSpawnOptions - Terminal process spawn options.
 * @defaultValue `{ detached: true, stdio: 'ignore' }`
 */
export type TerminalExecutor = (command: string, terminalArgs?: string[], terminalSpawnOptions?: SpawnOptions) => ChildProcess