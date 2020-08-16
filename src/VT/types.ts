import { SpawnOptions, ChildProcess } from 'child_process'


/**
 * Run command from Terminal.
 * @param command - String representation of command.
 * @param terminalArgs - Options for terminal.
 * @defaultValue `[]`
 * @param terminalSpawnOptions - Terminal spawn options.
 * @defaultValue `{ detached: true, stdio: 'ignore' }`
 */
export type TerminalExecutor = (command: string, terminalArgs?: string[], terminalSpawnOptions?: SpawnOptions) => ChildProcess