import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../api/auth';

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (u: User | null) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authApi.getCurrentUser()
            .then((u) => setUser(u))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = (u: User | null) => setUser(u);

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
