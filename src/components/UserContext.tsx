import React, { createContext, useState, ReactNode } from 'react';
import { User } from '../types/User';

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    isLoggedIn: () => boolean;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);

    const setUser = (user: User) => {
        setUserState(user);
    };

    const isLoggedIn = () => {
        return user !== null;
    };

    const logout = () => {
        setUserState(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn, logout }}>
            {children}
        </UserContext.Provider>
    );
};