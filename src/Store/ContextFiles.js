import { createContext, useState } from "react"

// Firbase Context
export const FirebaseContext = createContext(null)

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