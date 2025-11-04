import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {Portfolio, PortfolioHistoryPoint, Transaction} from "../types/portfolioTypes";

interface PortfolioContextProps {
    portfolio: Portfolio | null;
    history: PortfolioHistoryPoint[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
    expandedTransactions: Record<string, Transaction[]>;
    setTransactionToDelete: (payload: { transaction: Transaction; portfolioId: number }) => void;
    setExpandedTransactions: React.Dispatch<React.SetStateAction<Record<string, Transaction[]>>>;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) throw new Error("usePortfolio must be used within PortfolioProvider");
    return context;
};

interface PortfolioProviderProps {
    userId: string;
    foundName: string;
    id: number;
    children: ReactNode;
}

export const PortfolioProvider = ({ userId, foundName, id, children }: PortfolioProviderProps) => {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [history, setHistory] = useState<PortfolioHistoryPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedTransactions, setExpandedTransactions] = useState<Record<string, Transaction[]>>({});
    const [transactionToDelete, setTransactionToDelete] = useState<{ transaction: Transaction; portfolioId: number } | null>(null);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`http://localhost:8080/v1/api/portfolio/${id}/history`);
            const data = await response.json();
            setHistory(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchHistory();

        let isUnmounted = false;
        let eventSource: EventSource | null = null;

        const connect = () => {
            if (isUnmounted) return;

            eventSource = new EventSource(`http://localhost:8080/v1/api/portfolio/${id}`);

            eventSource.onmessage = (event) => {
                try {
                    const incoming: Portfolio = JSON.parse(event.data);

                    setPortfolio((prev) => {
                        if (!prev) return incoming;

                        const previousItems = prev.items ?? []; // ✅ zabezpieczenie przed undefined
                        const itemsMap = new Map(previousItems.map((item) => [item.symbol, item]));                        incoming.items.forEach((updatedItem) => {
                            itemsMap.set(updatedItem.symbol, updatedItem);
                        });

                        return {
                            ...prev,
                            ...incoming,
                            items: Array.from(itemsMap.values()),
                        };
                    });

                    setLoading(false);
                } catch (err) {
                    console.error("Błąd parsowania SSE", err);
                    setError("Błąd danych portfela");
                    setLoading(false);
                }
            };

            eventSource.onerror = () => {
                if (!isUnmounted) {
                    console.warn("SSE przerwane, próba reconnect za 5 sekund...");
                    eventSource?.close();
                    setTimeout(connect, 5000);
                }
            };
        };

        connect();

        return () => {
            isUnmounted = true;
            eventSource?.close();
        };
    }, [id]);

    return (
        <PortfolioContext.Provider
            value={{
                portfolio,
                history,
                loading,
                error,
                refresh: fetchHistory,
                expandedTransactions,
                setExpandedTransactions,
                setTransactionToDelete,
            }}
        >
            {children}
        </PortfolioContext.Provider>
    );
};
