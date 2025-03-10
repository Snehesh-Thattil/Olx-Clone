import { createContext, useState } from "react";

// Products Context
export const productsContext = createContext(null)

export function PostContextWrapper({ children }) {
    const [products, setProducts] = useState(null)

    return (
        <productsContext.Provider value={{ products, setProducts }}>
            {children}
        </productsContext.Provider>
    )
}