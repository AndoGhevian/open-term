import { SearchConfig } from "../types"
import { PlatformsList } from "../../VT/types"

/**
 * Convert's **SearchConfig** options with allready applied defaults to terminal-names list.
 * @param searchConfig - **SearchConfig** options object with no missing properties.
 * @returns **terms** list with applied exclusions and sorted by specified priority.
 */
export default function searchConfigToList(searchConfig: Required<SearchConfig<PlatformsList>>) {
    const sortedList: string[] = []
    for (const term of searchConfig.terms) {
        const excludeTerms = searchConfig.excludeTerms as string[]
        if (!excludeTerms.includes(term)) {
            sortedList.push(term)
        }
    }

    const priorityList = searchConfig.priorityTerms as string[]
    sortedList.sort((a, b) => {
        const aIndex = priorityList.indexOf(a)
        const bIndex = priorityList.indexOf(b)

        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
        return aIndex === -1 ? 1 : -1
    })
    return sortedList
}