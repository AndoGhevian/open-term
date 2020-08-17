import { VTexecInclusion } from "./types"

/**
 * Virtual Terminal search algorithm default configurations for Linux platform.
 */
export const linux: Required<VTexecInclusion<'linux'>> = {
    priorityTerms: ['xterm', 'guake', 'konsole', 'xfce'],
    terms: ['xterm', 'guake', 'konsole', 'xfce'],
    excludeTerms: [],
}

/**
 * Virtual Terminal search algorithm default configurations for win32 platform.
 */
export const win32: Required<VTexecInclusion<'win32'>> = {
    priorityTerms: ['cmd'],
    terms: ['cmd'],
    excludeTerms: [],
}