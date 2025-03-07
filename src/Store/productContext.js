import { createContext, useState } from "react";

// Products Context
export const PostContext = createContext(null)

export function PostContextWrapper({ children }) {
    const [products, setProducts] = useState(null)

    return (
        <PostContext.Provider value={{ products, setProducts }}>
            {children}
        </PostContext.Provider>
    )
}