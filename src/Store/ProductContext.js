import { createContext, useState } from "react";

// Products Context
export const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState(null)

    return (
        <ProductsContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductsContext.Provider>
    )
}