import { VTPlatforms, VT } from "../VT"

/**
 * Linux Terminals List. 
 * > NOTE: Order of this List is used as default when determining priority of linux terminals against each other.
 */
export type LinuxTerminals = keyof typeof VT.linux

/**
 * Win32 Terminals List.
 * > NOTE: Order of this List is used as default when determining priority of win32 terminals against each other.
 */
export type Win32Terminals = keyof typeof VT.win32

/**
 * Defines terminal search algorithm configuration for each platform. See {@link VTPlatforms}.
 */
export type VTexecInclusion<P extends VTPlatforms> = {
    /**
     * Defines priority terminals to look for first.
     * @defaultValue `undefined` : Means use order of **"PlatformTerminals"** list for current platform.
     */
    priorityTerms?: P extends 'linux' ? LinuxTerminals[] : P extends 'win32' ? Win32Terminals[] : string[]
    /**
     * Defines terminals to look for.
     * @defaultValue `undefined` : Means use of **"PlatformTerminals"** list for current Platform.
     */
    terms?: P extends 'linux' ? LinuxTerminals[] : P extends 'win32' ? Win32Terminals[] : string[]
    /**
     * Defines terminals to exclude from search list.
     * @defaultValue `undefined` - Means no exclusions applied.
     */
    excludeTerms?: P extends 'linux' ? LinuxTerminals[] : P extends 'win32' ? Win32Terminals[] : string[]
}

/**
 * Defines terminal search algorithm configuration for all over the platforms. See {@link VTPlatforms}.
 * @remarks If Some platform set to "`null`" it will be excluded from search algorithm.
 * 
 * e.g. if You provide as VTInclusion `{ AnyOsName: null, ... }`, that Os will be considered as not supported.
 */
export type VTexecOptions = { [key: string]: null | any } & {
    [P in VTPlatforms]?: VTexecInclusion<P> | null
} & {
    /**
     * Prioritizes the platforms whose first found terminal to use if the original platform is not supported.
     * @remarks If provided value is:
     * 1. "`undefined`" ( or not provided ) -- Search algorithm will iterate through all platforms by predefined order of **"VTPlatforms"** list, and
     * bulk search for valid terminal from **"PlatformTerminals"** list of each platform until one is found.
     *     > 1. See {@link VTPlatforms} for predefined order of supported platforms.
     *     > 1. See {@link LinuxTerminals} and {@link Win32Terminals} for **"PlatformTerminals"** lists.
     * 1. "`null`" -- Search algorithm will immidiately end with Error: _"NotSupported"_ if your platform is not supported.
     * @defaultValue `undefined` : Means bulk search will be performed. See first remark.
     */
    default?: VTPlatforms[] | null;
}