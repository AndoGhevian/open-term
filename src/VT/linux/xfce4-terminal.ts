import { spawn, SpawnOptions } from "child_process"
import { TerminalExecutor } from "../types"

/**Run command from xfce4-terminal. */
const runXfce: TerminalExecutor = (command: string, terminalArgs: string[] = [], {
    detached = true,
    stdio = 'ignore',
    ...restSpawnOptions
} = {} as SpawnOptions) => {
    const cwd = process.cwd()

    const args = ['--hold', '--working-directory', cwd, '-e', command,]

    if (terminalArgs.includes('--hold') || terminalArgs.includes('-H')) {
        args.splice(0, 1)
    }

    if (terminalArgs.includes('-e') || terminalArgs.includes('--command') || terminalArgs.includes('-x') || terminalArgs.includes('--execute')) {
        let eIndex = args.indexOf('-e')
        args.splice(eIndex, 2)
    }

    if (terminalArgs.includes('--working-directory')) {
        let workingDirectoryIndex = args.indexOf('--working-directory')
        args.splice(workingDirectoryIndex, 2)
    }

    args.splice(args.length - 1, 0, ...terminalArgs)
    console.log(args)
    const cmdProcess = spawn('xfce4-terminal', args, {
        detached,
        stdio,
        ...restSpawnOptions
    })
    return cmdProcess
}

export default runXfce



// // test
// const command = 'node tests/test2.js'
// const cmdProcess = runXfce(command)
// if(!cmdProcess.pid) {
//     throw new Error('xfce4-terminal not found.')
// }
// cmdProcess.unref()