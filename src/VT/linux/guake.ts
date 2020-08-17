import { spawn, SpawnOptions } from 'child_process'

import { TerminalExecutor } from '../types'

/**Run command from Guake Terminal. */
const runGuake: TerminalExecutor = (command: string, terminalArgs, {
    detached = true,
    stdio = 'ignore',
    ...restSpawnOptions
} = {} as SpawnOptions) => {
    const cwd = process.cwd()

    let args = ['--show', '-n', cwd]
    if(terminalArgs) {
        args = [...terminalArgs]
    }

    if (!args.includes('-e') && !args.includes('--execute-command')) {
        args.push('--execute-command', command)
    }

    // console.log(args)
    const cmdProcess = spawn('guake', args, {
        detached,
        stdio,
        ...restSpawnOptions
    })
    return cmdProcess
}

export default runGuake



// // test
// const path = require('path')
// const testPath = path.join(__dirname, './test.js')
// //
// console.log('aaaaaaa')
// const command = `node ${testPath}`
// const cmdProcess = runGuake(command, [])
// if (!cmdProcess.pid) {
//     throw new Error('Cant start process.')
// }
// cmdProcess.unref()