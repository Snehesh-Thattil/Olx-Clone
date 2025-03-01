import { createContext, useState } from "react";

export const PostContext = createContext(null)

export default function Post({ children }) {
    const [prodDtls, setProdDtls] = useState(null)

    return (
        <PostContext.Provider value={{ prodDtls, setProdDtls }}>
            {children}
        </PostContext.Provider>
    )
}