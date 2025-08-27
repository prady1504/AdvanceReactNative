import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getToken, saveToken, clearToken } from '../utils/secureStore';
import { loginApi } from '../utils/auth-api';


export type AuthContextType = {
    token: string | null;
    loading: boolean; // while restoring token at app start
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};


export const AuthContext = createContext<AuthContextType>({
    token: null,
    loading: true,
    signIn: async () => { },
    signOut: async () => { },
});


export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    // Restore token on app start
    useEffect(() => {
        (async () => {
            try {
                const t = await getToken();
                setToken(t);
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const signIn = useCallback(async (username: string, password: string) => {
        const t = await loginApi({ username, password });
        await saveToken(t);
        setToken(t);
    }, []);


    const signOut = useCallback(async () => {
        await clearToken();
        setToken(null);
    }, []);


    const value = useMemo(() => ({ token, loading, signIn, signOut }), [token, loading, signIn, signOut]);


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};