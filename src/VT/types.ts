import { SpawnOptions, ChildProcess } from 'child_process'

/**Defines supported platforms. */
export type VTPlatforms = (typeof VTPlatforms)[number]
export const VTPlatforms: ['linux', 'win32'] = ['linux', 'win32']

/**
 * Run command from Terminal.
 * @param command - String representation of command.
 * @param terminalArgs - Options for terminal.
 * @defaultValue `undefined`
 * @param terminalSpawnOptions - Terminal spawn options.
 * @defaultValue `{ detached: true, stdio: 'ignore' }`
 */
export type TerminalExecutor = (command: string, terminalArgs?: string[], terminalSpawnOptions?: SpawnOptions) => ChildProcess