import { ChildProcess } from 'child_process'

import { VT, TerminalExecutor, PlatformsList } from '../VT'
import {
    VTexecConfig,
    SearchConfig,
} from './types'

import {
    searchConfigToList,
    setVTexecConfigDefaults,
} from './utils'

import * as searchConfigDefaults from './searchConfigDefaults'


/**This function designed to capture virtual terminal startup errors. */
const omitError = (error: any) => null


/**
 * This function automatically find and run terminal with provided command. using **VTExecConfigDefaults** as second argument.
 * @param command - String representation of command.
 * @param vtExecConfig - Terminal searching algorithm configuration.
 * @defaultValue
 * ```
 * { 
 * 
 * linux: linuxSearchConfigDefaults,
 * 
 * win32: win32SearchConfigDefaults,
 * 
 * default: PlatformsList
 * 
 * }```
 */
export default function VTexec(command: string): ChildProcess
/**
 * This function automaticaly find and run terminal with provided command.
 * @param command - String representation of command.
 * @param vtExecConfig - Terminal searching algorithm configuration.
 */
export default function VTexec(command: string, vtExecConfig: VTexecConfig): ChildProcess
export default function VTexec(command: string, vtExecConfig?: VTexecConfig): any {
    const vtExecConfigWithDefaults = setVTexecConfigDefaults(vtExecConfig)

    function findVt(platform: PlatformsList, vtList: string[]) {
        const supportedVtMap = VT[platform] as { [key: string]: TerminalExecutor }
        for (const vt of vtList) {
            const terminalExecutor = supportedVtMap[vt]
            if (terminalExecutor) {
                const termProc = terminalExecutor(command)
                if (termProc.pid) return termProc

                termProc.on('error', omitError)
            }
        }
        throw new Error(`No Virtual Terminal Emulator found for platform: ${platform}, with provided "SearchConfig" vtExecConfig!`)
    }

    if (typeof command !== 'string') {
        throw new Error('Please provide command string to execute in VT.')
    }
    const platform = process.platform

    if (vtExecConfigWithDefaults[platform] === null) throw new Error(`Platform: ${platform} is not supported.`)

    switch (platform) {
        case 'linux':
        case 'win32':
            const vtList = searchConfigToList(vtExecConfigWithDefaults[platform]! as Required<SearchConfig<PlatformsList>>)
            return findVt(platform, vtList)
        default:
            break
    }

    if (vtExecConfigWithDefaults.default === null) throw new Error(`Platform: ${platform} is not supported.`)

    for (const fallbackPlatform of vtExecConfigWithDefaults.default) {
        if (Object.keys(VT).includes(fallbackPlatform)) {
            const vtList = searchConfigToList(searchConfigDefaults[fallbackPlatform])
            try {
                return findVt(fallbackPlatform, vtList)
            } catch (err) { }
        }
    }
    throw new Error(`No fallback Virtual Terminal Emulator found in platforms: ${vtExecConfigWithDefaults.default}`)
}