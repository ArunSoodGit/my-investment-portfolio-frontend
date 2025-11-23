import React, { useState } from "react";
import { Portfolio, PortfolioItem, Transaction } from "../types/portfolioTypes";
import * as FaIcons from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DeleteTransactionModal from "./DeleteTransactionModal";
import { deleteTransaction, getTransactionsForItem } from "../services/api";
import "./PortfolioTable.css";
import {useAuth} from "./auth/AuthContext";

const FaSearch = FaIcons.FaSearch as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaChevronDown = FaIcons.FaChevronDown as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaTimes = FaIcons.FaTimes as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

interface PortfolioTableProps {
    portfolio: Portfolio;
    items: PortfolioItem[];
    onRefresh?: () => void;
}

interface TransactionToDelete {
    transaction: Transaction;
    portfolioId: number;
}

export default function PortfolioTable({ items, portfolio, onRefresh }: PortfolioTableProps) {
    const [hoveredItem, setHoveredItem] = useState<PortfolioItem | null>(null);
    const [expandedTransactions, setExpandedTransactions] = useState<Record<string, Transaction[]>>({});
    const [loadingTransactions, setLoadingTransactions] = useState<Record<string, boolean>>({});
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<TransactionToDelete | null>(null);
    const navigate = useNavigate();
    const { token } = useAuth();
    const [error, setError] = useState<string | null>(null);

    if (!portfolio) {
        return <div className="empty-message">⚠️ Brak danych o portfelu.</div>;
    }

    const handleToggleTransactions = async (item: PortfolioItem) => {
        const isAlreadyOpen = hoveredItem === item;
        setHoveredItem(isAlreadyOpen ? null : item);

        // Jeśli zamykamy lub dane już istnieją — nie ładujemy ponownie
        if (isAlreadyOpen || expandedTransactions[item.symbol]) return;

        setLoadingTransactions(prev => ({ ...prev, [item.symbol]: true }));

        try {
            if (!token) {
                setError("Musisz być zalogowany");
                return;
            }
            const transactions = await getTransactionsForItem(portfolio.id, item.symbol, token);
            setExpandedTransactions(prev => ({ ...prev, [item.symbol]: transactions }));
        } catch (err) {
            console.error("❌ Błąd przy pobieraniu transakcji:", err);
        } finally {
            setLoadingTransactions(prev => ({ ...prev, [item.symbol]: false }));
        }
    };

    const handleDelete = async () => {
        if (!transactionToDelete) return;

        try {
            if (!token) {
                setError("Musisz być zalogowany");
                return;
            }
            await deleteTransaction(transactionToDelete.portfolioId, transactionToDelete.transaction.id, token);
            console.log("✅ Transakcja usunięta!");
            setDeleteModalOpen(false);
            setTransactionToDelete(null);

            // Odśwież listę transakcji dla tego symbolu
            setExpandedTransactions(prev => ({
                ...prev,
                [transactionToDelete.transaction.symbol]: prev[transactionToDelete.transaction.symbol]?.filter(
                    t => t.id !== transactionToDelete.transaction.id
                )
            }));

            onRefresh?.();
        } catch (err) {
            console.error("❌ Błąd przy usuwaniu transakcji:", err);
        }
    };

    return (
        <div>
            <div className="table-header">
                <h2 className="table-title">📊 Skład portfela</h2>
            </div>

            {!items?.length ? (
                <div className="empty-message">
                    📭 Brak pozycji w portfelu. Możesz dodać pierwszą transakcję.
                </div>
            ) : (
                <table className="portfolio-table">
                    <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Nazwa</th>
                        <th>Zmiana dzienna (%)</th>
                        <th>Średnia cena zakupu</th>
                        <th>Aktualna cena</th>
                        <th>Wolumen</th>
                        <th>Wartość</th>
                        <th>Zysk ($)</th>
                        <th>Zysk (%)</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <React.Fragment key={item.symbol}>
                            <tr>
                                <td>{item.symbol}</td>
                                <td>{item.name}</td>
                                <td className={item.percentageChange?.includes('-') ? "loss" : "profit"}>
                                    {item.percentageChange ?? "-"}
                                </td>
                                <td>{item.averagePurchasePrice}$</td>
                                <td>{item.currentPrice}$</td>
                                <td>{item.totalQuantity}</td>
                                <td>{item.totalValue}$</td>
                                <td className={item.profit >= 0 ? "profit" : "loss"}>{item.profit}$</td>
                                <td className={item.profitPercentage.includes('-') ? "loss" : "profit"}>
                                    {item.profitPercentage}
                                </td>
                                <td
                                    onClick={() => handleToggleTransactions(item)}
                                    style={{ cursor: "pointer", textAlign: "center" }}
                                >
                                    <FaChevronDown
                                        style={{
                                            transform: hoveredItem === item ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.3s"
                                        }}
                                    />
                                </td>
                                <td
                                    className="icon-cell"
                                    onClick={() => navigate(`/portfolio/item/${item.symbol}`, { state: { item, portfolio } })}
                                >
                                    <FaSearch />
                                </td>
                            </tr>

                            {/* Sekcja z transakcjami */}
                            <tr>
                                <td colSpan={11} style={{ padding: 0, border: 0 }}>
                                    <div
                                        style={{
                                            maxHeight: hoveredItem === item ? "500px" : "0px",
                                            overflow: "hidden",
                                            transition: "max-height 0.3s ease",
                                        }}
                                    >
                                        {loadingTransactions[item.symbol] ? (
                                            <div className="loading-row">⏳ Ładowanie transakcji...</div>
                                        ) : expandedTransactions[item.symbol] ? (
                                            <table className="transaction-table">
                                                <thead>
                                                <tr>
                                                    <th>Pozycja HP</th>
                                                    <th>Data</th>
                                                    <th>Cena zakupu ($)</th>
                                                    <th>Aktualna cena ($)</th>
                                                    <th>Wolumen</th>
                                                    <th>Zysk %</th>
                                                    <th></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {expandedTransactions[item.symbol].map((transaction, index) => (
                                                    <tr key={transaction.id}>
                                                        <td>HP{index + 1}</td>
                                                        <td>{transaction.date}</td>
                                                        <td>{transaction.purchasePrice}$</td>
                                                        <td>{transaction.currentPrice}$</td>
                                                        <td>{transaction.quantity}</td>
                                                        <td className={transaction.profitPercentage.includes('-') ? "loss" : "profit"}>
                                                            {transaction.profitPercentage}
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <button
                                                                onClick={() => {
                                                                    setTransactionToDelete({ transaction, portfolioId: item.id });
                                                                    setDeleteModalOpen(true);
                                                                }}
                                                                style={{
                                                                    background: "transparent",
                                                                    border: "none",
                                                                    color: "red",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="empty-row">🔍 Brak transakcji do wyświetlenia</div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            )}

            <DeleteTransactionModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                transaction={transactionToDelete?.transaction}
            />
        </div>
    );
}
