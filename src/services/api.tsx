import {Transaction} from "../types/portfolioTypes";

const API_BASE = "http://localhost:8080/v1/api";

export async function addTransaction(portfolioId: number, transaction: Transaction): Promise<Transaction> {
    const response = await fetch(`${API_BASE}/transaction/${portfolioId}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error("Nie udało się dodać transakcji");
    return response.json(); // zwróci nowo dodaną transakcję z ID
}

export async function deleteTransaction(portfolioId: number, transactionId: number): Promise<void> {
    const response = await fetch(`${API_BASE}/transaction/${transactionId}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Nie udało się usunąć transakcji");
}

/**
 * Pobiera listę transakcji dla danego portfolio i symbolu
 */
export async function getTransactionsForItem(portfolioId: number, symbol: string): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE}/transaction/${portfolioId}/${symbol}`);
    if (!response.ok) throw new Error("Nie udało się pobrać transakcji");
    const data = await response.json();
    return data as Transaction[];
}