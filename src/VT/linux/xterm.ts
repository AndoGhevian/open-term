import { TerminalExecutor } from "../types"
import { spawn, SpawnOptions } from "child_process"


/**Run command from xterm. */
const runXterm: TerminalExecutor = (command: string, terminalArgs, {
    detached = true,
    stdio = 'ignore',
    ...restSpawnOptions
} = {} as SpawnOptions) => {
    let args = ['-hold', '-e', command,]
    if (terminalArgs) {
        args = [...terminalArgs]
    }

    if (!args.includes('-e')) {
        args.push('-e', command)
    }

    // console.log(args)
    const cmdProcess = spawn('xterm', args, {
        detached,
        stdio,
        ...restSpawnOptions
    })
    return cmdProcess
}

export default runXterm



// // //test
// const path = require('path')
// const testPath = path.join(__dirname, './test.js')
// //
// console.log('aaaaaaa')
// const command = `node ${testPath}`
// const cmdProcess = runXterm(command)
// if(!cmdProcess.pid) {
//     throw new Error('xterm not found.')
// }
// cmdProcess.unref()