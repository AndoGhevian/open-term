import { ChildProcess } from 'child_process'

import { VT, TerminalExecutor, VTPlatforms } from '../VT'
import {
    VTexecOptions,
    VTexecInclusion,
} from './types'

import {
    inclusionToList,
    setInclusionDefaults,
} from './utils'

import * as inclusionDefaults from './inclusionDefaults'

/**This function designed to capture virtual terminal startup errors. */
const omitError = (error: any) => null

export default function VTexec(command: string): ChildProcess
export default function VTexec(command: string, options?: VTexecOptions): ChildProcess
export default function VTexec(command: string, options?: VTexecOptions): any {
    const optionsWithDefaults = setInclusionDefaults(options)

    function findVt(platform: VTPlatforms, vtList: string[]) {
        const supportedVtMap = VT[platform] as { [key: string]: TerminalExecutor }
        for (const vt of vtList) {
            const terminalExecutor = supportedVtMap[vt]
            if (terminalExecutor) {
                const termProc = terminalExecutor(command)
                if(termProc.pid) return termProc
                
                termProc.on('error', omitError)
            }
        }
        throw new Error(`No Virtual Terminal Emulator found for platform: ${platform}, with provided "VTexecInclusion" options!`)
    }

    if (typeof command !== 'string') {
        throw new Error('Please provide command string to execute in VT.')
    }
    const platform = process.platform

    if (optionsWithDefaults[platform] === null) throw new Error(`Platform: ${platform} is not supported.`)

    switch (platform) {
        case 'linux':
        case 'win32':
            const vtList = inclusionToList(optionsWithDefaults[platform]! as Required<VTexecInclusion<VTPlatforms>>)
            return findVt(platform, vtList)
        default:
            break
    }

    if (optionsWithDefaults.default === null) throw new Error(`Platform: ${platform} is not supported.`)

    for (const fallbackPlatform of optionsWithDefaults.default) {
        if (VTPlatforms.includes(fallbackPlatform)) {
            const vtList = inclusionToList(inclusionDefaults[fallbackPlatform])
            try {
                return findVt(fallbackPlatform, vtList)
            } catch (err) { }
        }
    }
    throw new Error(`No fallback Virtual Terminal Emulator found in platforms: ${optionsWithDefaults.default}`)
}