import { createContext, useState } from "react"

// Firbase Context
export const FirebaseContext = createContext(null)

// Authentication Context
export const AuthContext = createContext(null)

export function AuthContextWrapper({ children }) {
    const [User, setUser] = useState(null)
    return (
        <AuthContext.Provider value={{ User, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}