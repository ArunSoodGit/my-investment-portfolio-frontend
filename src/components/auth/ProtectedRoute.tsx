import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { token, logout } = useAuth();
    const [valid, setValid] = useState<boolean | null>(null); // null = sprawdzanie

    useEffect(() => {
        const check = async () => {
            if (!token) {
                setValid(false);
                return;
            }

            try {
                const res = await fetch("http://localhost:8080/v1/api/auth/validate", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    setValid(true);
                } else {
                    logout(); // usuń nieważny token
                    setValid(false);
                }
            } catch {
                logout();
                setValid(false);
            }
        };

        check();
    }, [token, logout]);

    if (valid === null) return <div>Sprawdzanie tokena...</div>; // loader
    if (!valid) return <Navigate to="/login" replace />;
    return <>{children}</>;
}
