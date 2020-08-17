import {
    linux as linuxInclusionDefaults,
    win32 as win32InclusionDefaults,
} from './inclusionDefaults'

/****VTexecInclusion** default values for supported platforms. */
const inclusionDefaults = {
    /****VTexecInclusion** default value for linux. */
    linux: linuxInclusionDefaults,
    /****VTexecInclusion** default value for win32. */
    win32: win32InclusionDefaults
}


export {
    VTexecInclusion,
    VTexecOptions,
    LinuxTerminals,
    Win32Terminals,
} from './types'
export { inclusionDefaults }
export * as utils from './utils'
export { default as VTexec } from './VTexec'