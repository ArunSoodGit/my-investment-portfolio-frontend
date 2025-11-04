import React, { useState } from "react";
import { usePortfolio } from "./PortfolioContext";
import AddTransactionForm from "./AddTransactionForm";
import AddTransactionModal from "./AddTransactionModal";
import "./PortfolioView.css";
import PortfolioChart from "./PortfolioChart";
import PortfolioTable from "./PortfolioTable";


export default function PortfolioView() {
    const { portfolio, history, loading, error } = usePortfolio();
    const [isModalOpen, setModalOpen] = useState(false);

    if (loading) return <div className="loading">Ładowanie danych portfela...</div>;
    if (error) return <div className="error">❌ Błąd: {error}</div>;
    if (!portfolio) return <div>Brak danych portfela</div>;

    return (
        <div className={`portfolio-container p-5 rounded`}>
            <h1 className="portfolio-title">💼 Portfel inwestycyjny {portfolio.portfolioName}</h1>

            <div className="portfolio-summary">
                <div><strong>Zainwestowane:</strong> {portfolio.totalInvested} $</div>
                <div><strong>Aktualna wartość:</strong> {portfolio.totalCurrentValue} $</div>
                <div><strong>Zysk / Strata:</strong>
                    <span className={portfolio.totalProfit >= 0 ? "profit" : "loss"}>
                        {portfolio.totalProfit}$ ({portfolio.totalProfitPercentage})
                    </span>
                </div>
            </div>

            <PortfolioTable items={portfolio.items} portfolio={portfolio} />

            <button className="add-transaction-btn" onClick={() => setModalOpen(true)}>Dodaj transakcję</button>

            <AddTransactionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <AddTransactionForm id={portfolio.id} onTransactionAdded={() => setModalOpen(false)} />
            </AddTransactionModal>

            <PortfolioChart data={history} />
        </div>
    );
}
