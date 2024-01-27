import { createContext, useState } from "react";

export const PostContext = createContext(null)

export default function Post({ children }) {
    const [ProdDtls, setProdDtls] = useState(null)

    return (
        <PostContext.Provider value={{ ProdDtls, setProdDtls }}>
            {children}
        </PostContext.Provider>
    )
}