import { createContext, useState } from "react";

// Context to show loginBox on certain clicks
export const LoginBoxContext = createContext(null)

export function LoginBoxProvider({ children }) {
    const [loginBox, setLoginBox] = useState(null)

    return (
        <LoginBoxContext.Provider value={{ loginBox, setLoginBox }}>
            {children}
        </LoginBoxContext.Provider>
    )
}