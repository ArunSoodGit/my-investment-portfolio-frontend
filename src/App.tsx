import React from "react";
import {Route, Routes} from "react-router-dom";
import PortfolioView from "./components/PortfolioView";
import PortfolioItemDetails from "./components/PortfolioItemDetails";
import {PortfolioProvider} from "./components/PortfolioContext";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import {AuthProvider} from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function AppContent() {

    return (
        <PortfolioProvider userId="1" foundName="XTB_USD" id={1}>
            <div
                className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-500">
                <Routes>
                    {/* Nie przekazujemy już fundName ani id */}
                    <Route
                        path="/portfolio"
                        element={
                            <ProtectedRoute>
                                <PortfolioView />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/portfolio/item/:symbol"
                        element={
                            <ProtectedRoute>
                                <PortfolioItemDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                </Routes>
            </div>
        </PortfolioProvider>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent/>
        </AuthProvider>
    );
}
