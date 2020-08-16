import { TerminalExecutor } from "../types"
import { spawn, SpawnOptions } from "child_process"

/**Run command from xterm. */
const runXterm: TerminalExecutor = (command: string, terminalArgs: string[] = [], {
    detached = true,
    stdio = 'ignore',
    ...restSpawnOptions
} = {} as SpawnOptions) => {
    const args = ['-hold', '-e', command,]

    if (terminalArgs.includes('-hold') || terminalArgs.includes('+hold')) {
        args.splice(0, 1)
    }

    if (terminalArgs.includes('-e')) {
        let eIndex = args.indexOf('-e')
        args.splice(eIndex, 2, ...terminalArgs)
    } else {
        args.splice(0, 0, ...terminalArgs)
    }
    console.log(args)
    const cmdProcess = spawn('xterm', args, {
        detached,
        stdio,
        ...restSpawnOptions
    })
    return cmdProcess
}

export default runXterm



// //test
// const command = 'node tests/test2.js'
// const cmdProcess = runXterm(command)
// if(!cmdProcess.pid) {
//     throw new Error('xterm not found.')
// }
// cmdProcess.unref()