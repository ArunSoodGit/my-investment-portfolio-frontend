import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import {usePortfolio} from "./PortfolioContext";
import {deleteTransaction, getTransactionsForItem} from "../services/api";
import {Transaction} from "../types/portfolioTypes";
import "./PortfolioItemDetails.css";
import DeleteTransactionModal from "./DeleteTransactionModal";

const FaArrowLeft = FaIcons.FaArrowLeft as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaTimes = FaIcons.FaTimes as unknown as React.FC<React.SVGProps<SVGSVGElement>>;


interface TransactionToDelete {
    transaction: Transaction;
    portfolioId: number;
}

export default function PortfolioItemDetails() {
    const {symbol} = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const {portfolio, loading} = usePortfolio();

    const item = location.state?.item;
    const [localTransactions, setLocalTransactions] = useState<Transaction[] | null>(null);
    const portfolioId = location.state?.portfolioId
    const [expandedTransactions, setExpandedTransactions] = useState<Record<string, Transaction[]>>({});
    const [, setLoadingTransactions] = useState<Record<string, boolean>>({});
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<TransactionToDelete | null>(null);


    const fetchTransactions = async () => {
        if (!item || !symbol) return;

        try {
            console.log(portfolio?.id);
            const transactions = await getTransactionsForItem(portfolio?.id != null ? portfolio.id : 0, item.symbol);
            setLocalTransactions(transactions);
        } catch (err) {
            console.error("❌ Błąd przy pobieraniu transakcji:", err);
        } finally {
            console.log("Pobrano transakcje");
        }
    };


    useEffect(() => {

        fetchTransactions();

    }, [item, symbol, expandedTransactions, setExpandedTransactions]);

    if (!item) {
        return (
            <div className="portfolio-details">
                <h2>Nie znaleziono danych dla {symbol}</h2>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft/> Powrót
                </button>
            </div>
        );
    }

    const transactions = localTransactions ?? expandedTransactions[item.symbol] ?? [];
    const handleDelete = async () => {
        if (!transactionToDelete) return;

        try {
            await deleteTransaction(transactionToDelete.portfolioId, transactionToDelete.transaction.id);
            console.log("✅ Transakcja usunięta!");
            setDeleteModalOpen(false);
            setTransactionToDelete(null);

            // Odśwież listę transakcji dla tego symbolu

            fetchTransactions();
        } catch (err) {
            console.error("❌ Błąd przy usuwaniu transakcji:", err);
        }
    };
    return (
        <div className="portfolio-details">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft/> Powrót
            </button>

            <h2 className="portfolio-title">
                {item.name} ({item.symbol}) - {item.exchange}
            </h2>

            <div className="item-summary">
                <p>
                    <strong>Zysk/Strata:</strong>{" "}
                    <span className={item.profit >= 0 ? "profit-label" : "loss-label"}>
                        {item.profit}$ ({item.profitPercentage})
                    </span>
                </p>
                <p><strong>Wolumen:</strong> {item.totalQuantity}</p>
                <p><strong>Średnia cena zakupu:</strong> {item.averagePurchasePrice}$</p>
                <p><strong>Aktualna cena:</strong> {item.currentPrice}$</p>
                <p><strong>Wartość:</strong> {item.totalValue}$</p>
            </div>

            <h3 className="transaction-title">Historia transakcji</h3>
            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-row">⏳ Ładowanie transakcji...</div>
                ) : transactions.length === 0 ? (
                    <div className="empty-row">🔍 Brak transakcji do wyświetlenia</div>
                ) : (
                    <table className="transaction-table">
                        <thead>
                        <tr>
                            <th>HP</th>
                            <th>Data</th>
                            <th>Cena zakupu</th>
                            <th>Wolumen</th>
                            <th>Zysk %</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={tx.id}>
                                <td>HP{index + 1}</td>
                                <td>{tx.date}</td>
                                <td>{tx.purchasePrice}$</td>
                                <td>{tx.quantity}</td>
                                <td>
                                    <span className={tx.profitPercentage.includes('-') ? "loss-label" : "profit-label"}>
                                        {tx.profitPercentage}
                                    </span>
                                </td>
                                <td style={{textAlign: "center"}}>
                                    <button
                                        onClick={() => {
                                            setTransactionToDelete({transaction: tx, portfolioId: portfolioId});
                                            setDeleteModalOpen(true);
                                        }}

                                        style={{background: "transparent", border: "none", color: "red", cursor: "pointer"}}
                                    >
                                        <FaTimes/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <DeleteTransactionModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                transaction={transactionToDelete?.transaction}
            />
        </div>
    );
}
