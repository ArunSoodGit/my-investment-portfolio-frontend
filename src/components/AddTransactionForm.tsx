import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {addTransaction} from "../services/api";
import "./AddTransactionForm.css";
import {Transaction} from "../types/portfolioTypes";

interface AddTransactionFormProps {
    id: number;
    onTransactionAdded: () => void; // callback do odświeżenia portfela
}

export default function AddTransactionForm({id, onTransactionAdded}: AddTransactionFormProps) {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    const [purchasePrice, setPurchasePrice] = useState<number>(0);
    const [date, setDate] = useState<Date | null>(new Date());
    const [profitPercentage, setProfitPercentage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const newTransaction: Transaction = {
                id,
                symbol,
                profitPercentage,
                date: date ? date.toISOString().split("T")[0] : "",
                purchasePrice: purchasePrice,
                currentPrice: "",
                quantity,
            };

            console.log("📤 Wysyłam transakcję...", newTransaction);

            await addTransaction(id, newTransaction);

            console.log("✅ Transakcja dodana");

            // Odśwież formularz i portfel
            setSuccess(true);
            setSymbol("");
            setProfitPercentage("");
            setQuantity(0);
            setPurchasePrice(0);
            setDate(new Date());
            onTransactionAdded();
        } catch (err: any) {
            console.error("❌ Błąd podczas dodawania:", err);
            setError(err.message || "Błąd podczas dodawania transakcji");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="transaction-form" onSubmit={handleSubmit}>
            <h2>Dodaj transakcję</h2>

            <label>
                Symbol:
                <input value={symbol} onChange={e => setSymbol(e.target.value)} required/>
            </label>

            <label>
                Wolumen:
                <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    required
                />
            </label>

            <label>
                Cena jednostkowa:
                <input
                    type="number"
                    step="0.01"
                    value={purchasePrice}
                    onChange={e => setPurchasePrice(Number(e.target.value))}
                    required
                />
            </label>

            <label>
                Data transakcji:
                <DatePicker
                    selected={date}
                    onChange={(newDate: Date | null) => setDate(newDate)}
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    placeholderText="Wybierz datę"
                    className="date-picker-input"
                />
            </label>

            <button type="submit" disabled={loading}>
                {loading ? "Dodawanie..." : "Dodaj transakcję"}
            </button>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">✅ Transakcja dodana!</div>}
        </form>
    );
}
