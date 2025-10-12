import { createContext, useState } from "react"
import usePresence from "../Hooks/usePresence"

// Authentication Context
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    usePresence() // Update online presence

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}