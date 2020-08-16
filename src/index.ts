import * as VT from './VT'
import { ChildProcess } from 'child_process'

/**Defines supported platforms. */
type VTPlatform = (typeof VTPlatforms)[number]
const VTPlatforms: ['linux', 'windows'] = ['linux', 'windows']

/**
 * Defines terminal search algorithm configuration for each platform. See {@link VTPlatform}.
 */
type VTInclusion = {
    /**
     * Defines priority terminals to look for first.
     * @defaultValue `undefined` : Means use of **"PriorityList"** for current Platform.
     */
    priorityTerms?: string[]
    /**
     * Defines terminals to look for.
     * @defaultValue `undefined` : Means use of **"terminalsList"** for current Platform.
     */
    terms?: string[]
    /**
     * Defines terminals to exclude from search list.
     * @defaultValue `undefined`
     */
    excludeTerms?: string[]
}

/**
 * Defines terminal search algorithm configuration for all over the platforms. See {@link VTPlatform}.
 * @remarks If Some platform set to "`null`" it will be excluded from search algorithm.
 */
export type VTexecOptions = Partial<Record<VTPlatform, VTInclusion>> & {
    /**
     * Prioritizes the platforms whose first found terminal to use if the original platform is not supported.
     * @remarks If provided value is:
     * 1. "`undefined`" or not provided -- Search algorithm will iterate through all platforms by predefined order of **"VTPlatform"** list and if:
     *        > 1. _Options are provided for platform_ -- They will be used. NOTE: "`null`" is considered no options ( See next condition -> ).
     *        > 1. _Options not provied for platform_ -- Bulk search of hall **"terminalsList"** of platform will be performed. See {@link VTPlatform}.
     * 1. "`null`" -- Search algorithm will end with _Error_.
     * @defaultValue `undefined`
     */
    default?: VTPlatform[]
}

function VTexec(command: string): ChildProcess
function VTexec(command: string, options?: VTexecOptions): ChildProcess
function VTexec(command: string, {
    linux = {
        priorityTerms: ['xterm', 'guake', 'konsole', 'xfce'],
        terms: ['xterm', 'guake', 'konsole', 'xfce'],
        excludeTerms: [],
    },
    windows = {
        priorityTerms: ['cmd'],
        terms: ['cmd'],
        excludeTerms: [],
    },
    default: VTDefaultPlatform = [] // undefined - lookall, null - throw NotFound, array - look in array
} = {} as VTexecOptions): any {
    if (typeof command !== 'string') {
        throw new Error('Please provide command string to execute in VT.')
    }

    if (process.platform === 'linux') {
        for (const vt of Object.keys(VT.linux)) {
            const vtExec = VT.linux
            const cmd = VT[vt].cmd
            const execOption = VT[vt].exec
            const cmdProcess = spawn(cmd, [execOption, command], {
                detached: true,
                stdio: 'ignore'
            })

            cmdProcess.on('', () => {
                console.log('')
            })
        }
    }
}

VTexec('as', {
    linux: {
    },
    default 
})