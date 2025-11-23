import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";

interface AuthContextProps {
    token: string | null;
    refreshToken: string | null;
    login: (token: string, refreshToken: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
};

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken"));

    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    }, [token, refreshToken]);

    const login = (token: string, refreshToken: string) => {
        setToken(token);
        setRefreshToken(refreshToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setToken(null);
        setRefreshToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                refreshToken,
                login,
                logout,
                isAuthenticated: token !== null
            }}>
            {children}
        </AuthContext.Provider>
    );
};
