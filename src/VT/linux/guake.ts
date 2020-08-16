import { spawn, SpawnOptions } from 'child_process'

import { TerminalExecutor } from '../types'

/**Run command from Guake Terminal. */
const runGuake: TerminalExecutor = (command: string, terminalArgs: string[] = [], {
    detached = true,
    stdio = 'ignore',
    ...restSpawnOptions
} = {} as SpawnOptions) => {
    const cwd = process.cwd()

    const args = ['--show', '-n', cwd, '--execute-command', command]
    if (terminalArgs.includes('--hide') || terminalArgs.includes('--show')) {
        args.splice(0, 1)
    }
    if (terminalArgs.includes('-n') || terminalArgs.includes('--new-tab')) {
        const nIndex = args.indexOf('-n')
        args.splice(nIndex, 2)
    }
    if (terminalArgs.includes('-e') || terminalArgs.includes('--execute-command')) {
        const eIndex = args.indexOf('-e')
        args.splice(eIndex, 2)
    }

    args.splice(0, 0, ...terminalArgs)
    console.log(args)
    const cmdProcess = spawn('guake', args, {
        detached,
        stdio,
        ...restSpawnOptions
    })
    return cmdProcess
}

export default runGuake



// // test
// const command = 'node tests/test2.js'
// const cmdProcess = runGuake(command)
// if (!cmdProcess.pid) {
//     throw new Error('Cant start process.')
// }
// cmdProcess.unref()