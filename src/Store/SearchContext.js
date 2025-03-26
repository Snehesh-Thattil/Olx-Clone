import { createContext, useState } from "react";


export const SearchContext = createContext(null)

export function SearchProvider({ children }) {
    const [search, setSearch] = useState({ product: '', place: '' })

    return (
        <SearchContext.Provider value={{ search, setSearch }}>
            {children}
        </SearchContext.Provider>
    )
}