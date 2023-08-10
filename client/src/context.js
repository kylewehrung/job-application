import { createContext, useContext, useState } from "react";

export const UserContext = createContext({ user: null, setUser: () => {} });

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
    return useContext(UserContext);
}