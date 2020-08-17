import { VTexecInclusion } from "../types"
import { VTPlatforms } from "../../VT/types"

/**
 * Convert's **VTexecInclusion** options with allready applied defaults to terminal-names list.
 * @param vtInclusion - **VTexecInclusion** options object with no missing properties.
 * @returns **terms** list with applied exclusions and sorted by specified priority.
 */
export default function inclusionToList(vtInclusion: Required<VTexecInclusion<VTPlatforms>>) {
    const sortedList: string[] = []
    for (const term of vtInclusion.terms) {
        const excludeTerms = vtInclusion.excludeTerms as string[]
        if (!excludeTerms.includes(term)) {
            sortedList.push(term)
        }
    }

    const priorityList = vtInclusion.priorityTerms as string[]
    sortedList.sort((a, b) => {
        const aIndex = priorityList.indexOf(a)
        const bIndex = priorityList.indexOf(b)

        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
        return aIndex === -1 ? 1 : -1
    })
    return sortedList
}