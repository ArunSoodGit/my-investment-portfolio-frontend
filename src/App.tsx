import React from "react";
import { Routes, Route } from "react-router-dom";
import PortfolioView from "./components/PortfolioView";
import PortfolioItemDetails from "./components/PortfolioItemDetails";
import { PortfolioProvider } from "./components/PortfolioContext";

function AppContent() {

    return (
        <PortfolioProvider userId="1" foundName="XTB_USD" id={1}>
            <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-500">
                <Routes>
                    {/* Nie przekazujemy już fundName ani id */}
                    <Route path="/portfolio" element={<PortfolioView />} />
                    <Route path="/portfolio/item/:symbol" element={<PortfolioItemDetails />} />
                </Routes>
            </div>
        </PortfolioProvider>
    );
}

export default function App() {
    return (
            <AppContent />
    );
}
