import { spawn, SpawnOptions } from 'child_process'

import { TerminalExecutor } from '../types'

/**Run command from KDE-Konsole Terminal. */
const runKonsole: TerminalExecutor = (command: string, terminalArgs: string[] = [], {
    detached = true,
    stdio = 'ignore',
    ...restSpawnOptions
} = {} as SpawnOptions) => {
    const cwd = process.cwd()

    const args = ['--hold', '--workdir', cwd, '-e', command]
    if (terminalArgs.includes('--hold') || terminalArgs.includes('--noclose')) {
        args.splice(0, 1)
    }
    if (terminalArgs.includes('--workdir')) {
        const workdirIndex = args.indexOf('--workdir')
        args.splice(workdirIndex, 2)
    }
    if (terminalArgs.includes('-e')) {
        const eIndex = args.indexOf('-e')
        args.splice(eIndex, 2, ...terminalArgs)
    } else {
        args.splice(0, 0, ...terminalArgs)
    }

    console.log(args)
    const cmdProcess = spawn('konsole', args, {
        detached,
        stdio,
        ...restSpawnOptions
    })
    return cmdProcess
}

export default runKonsole



// // test
// const command = 'node tests/test2.js'
// const cmdProcess = runKonsole(command)
// if(!cmdProcess.pid) {
//     throw new Error('Konsole command not found.')
// }
// cmdProcess.unref()