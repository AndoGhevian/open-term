import { SpawnOptions, ChildProcess } from 'child_process'
import * as VT from './VT'

/**Defines supported platforms. */
export type VTPlatforms = (keyof typeof VT)

/**
 * Run command from Terminal.
 * @param command - String representation of command.
 * @param terminalArgs - Options for terminal.
 * @defaultValue `undefined`
 * @param terminalSpawnOptions - Terminal spawn options.
 * @defaultValue `{ detached: true, stdio: 'ignore' }`
 */
export type TerminalExecutor = (command: string, terminalArgs?: string[], terminalSpawnOptions?: SpawnOptions) => ChildProcess