import { VTexecInclusion } from "../types"

/**
 * Convert's **VTexecInclusion** options with allready applied defaults to "vt-names" list.
 * @param vtInclusion - **VTexecInclusion** options object with no missing properties.
 * @returns **terms** list with applied exclusions and sorted by specified priority.
 */
export default function inclusionToList(vtInclusion: Required<VTexecInclusion>) {
    const sortedList: string[] = []
    for (const term of vtInclusion.terms) {
        if (!vtInclusion.excludeTerms.includes(term)) {
            sortedList.push(term)
        }
    }

    const priorityList = vtInclusion.priorityTerms
    sortedList.sort((a, b) => {
        const aIndex = priorityList.indexOf(a)
        const bIndex = priorityList.indexOf(b)

        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
        return aIndex === -1 ? 1 : -1
    })
    return sortedList
}