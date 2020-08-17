import { VTexecInclusion } from "./types"

/**
 * Virtual Terminal search algorithm defaults for Linux platform.
 */
export const linux: Required<VTexecInclusion> = {
    priorityTerms: ['xterm', 'guake', 'konsole', 'xfce'],
    terms: ['xterm', 'guake', 'konsole', 'xfce'],
    excludeTerms: [],
}

/**
 * Virtual Terminal search algorithm defaults for win32 platform.
 */
export const win32: Required<VTexecInclusion> = {
    priorityTerms: ['cmd'],
    terms: ['cmd'],
    excludeTerms: [],
}