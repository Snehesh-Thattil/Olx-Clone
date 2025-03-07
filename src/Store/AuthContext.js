import { createContext, useState } from "react"

// Authentication Context
export const AuthContext = createContext(null)

export function AuthContextWrapper({ children }) {
    const [user, setUser] = useState(null)
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}