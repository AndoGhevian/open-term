import { VTPlatforms, VT } from '../../VT'
import {
    VTexecInclusion,
    VTexecOptions,
} from "../types"

import {
    linux as linuxInclusionDefaults,
    win32 as win32InclusionDefaults
} from '../inclusionDefaults'


function setLinuxInclusionDefaults(linuxInclusion: VTexecInclusion<'linux'>): void {
    if (linuxInclusion.priorityTerms === undefined) linuxInclusion.priorityTerms = linuxInclusionDefaults.priorityTerms
    if (linuxInclusion.terms === undefined) linuxInclusion.terms = linuxInclusionDefaults.terms
    if (linuxInclusion.excludeTerms === undefined) linuxInclusion.excludeTerms = linuxInclusionDefaults.excludeTerms
}


function setWin32InclusionDefaults(win32Inclusion: VTexecInclusion<'win32'>): void {
    if (win32Inclusion.priorityTerms === undefined) win32Inclusion.priorityTerms = win32InclusionDefaults.priorityTerms
    if (win32Inclusion.terms === undefined) win32Inclusion.terms = win32InclusionDefaults.terms
    if (win32Inclusion.excludeTerms === undefined) win32Inclusion.excludeTerms = win32InclusionDefaults.excludeTerms
}

/**
 * @returns **VTexecOptions** with filled default values.
 */
export default function setInclusionDefaults(options = {} as VTexecOptions): Required<VTexecOptions> {
    let {
        linux = linuxInclusionDefaults,
        win32 = win32InclusionDefaults,
        default: vtFallbackPlatforms = Object.keys(VT) as VTPlatforms[], // undefined - lookall, null - throw NotFound, array - look in array
        ...restOptions
    } = options
    if (linux !== null) setLinuxInclusionDefaults(linux)
    if (win32 !== null) setWin32InclusionDefaults(win32)
    return { linux, win32, default: vtFallbackPlatforms, ...restOptions }
}