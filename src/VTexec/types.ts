import { VTPlatforms } from "../VT"


/**
 * Defines terminal search algorithm configuration for each platform. See {@link VTPlatforms}.
 */
export type VTexecInclusion = {
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
     * @defaultValue `undefined` - Means no exclusions applied.
     */
    excludeTerms?: string[]
}

/**
 * Defines terminal search algorithm configuration for all over the platforms. See {@link VTPlatforms}.
 * @remarks If Some platform set to "`null`" it will be excluded from search algorithm.
 */
export type VTexecOptions = { [key: string]: null | any } & Partial<Record<VTPlatforms, VTexecInclusion | null>> & {
    /**
     * Prioritizes the platforms whose first found terminal to use if the original platform is not supported.
     * @remarks If provided value is:
     * 1. "`undefined`" ( or not provided ) -- Search algorithm will iterate through all platforms by predefined order of **"VTPlatforms"** list, and
     * bulk search of **"terminalsList"** of each platform will be performed. See {@link VTPlatforms}.
     * 1. "`null`" -- Search algorithm will end with Error: _NotSupported_.
     * @defaultValue `undefined`
     */
    default?: VTPlatforms[] | null;
}