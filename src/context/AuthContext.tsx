'use client'
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {User} from "@/types/test";
import {api} from "@/api/api";

type AuthContextValue = {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string, classNumber: number) => Promise<void>
    token: string | null,
    logout: () => Promise<void>,
    loading: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedToken = localStorage.getItem("token");

        const check = savedToken
            ? api.get<User>("/me").then((data) => {
                setUser(data);
                setToken(savedToken);
            })
            : Promise.resolve();

        check
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, [])


    async function login(email: string, password: string) {
        const data = await api.post<{user: User; token: string}>('/login', {email, password})
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
    }

    async function register(name: string, email: string, password: string, classNumber: number) {
        const data = await api.post<{user: User; token: string}>('/register', {name, email, password, class: classNumber})
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
    }

    async function logout() {
        await api.post('/logout')
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}
