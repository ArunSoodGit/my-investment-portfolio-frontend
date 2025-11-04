import React from "react";
import "./DeleteTransactionModal.css";
import {Transaction} from "../types/portfolioTypes";

interface DeleteTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    transaction?: Transaction;
}

export default function DeleteTransactionModal({isOpen, onClose, onConfirm, transaction}: DeleteTransactionModalProps) {
    if (!isOpen || !transaction) return null;
    console.log(transaction.id);
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>🗑️ Usuń transakcję</h3>
                <p>Czy na pewno chcesz usunąć tę transakcję?</p>

                <table className="transaction-info">
                    <tbody>
                    <tr>
                        <td><strong>Symbol:</strong></td>
                        <td>{transaction.symbol}</td>
                    </tr>
                    <tr>
                        <td><strong>Data:</strong></td>
                        <td>{transaction.date}</td>
                    </tr>
                    <tr>
                        <td><strong>Cena zakupu:</strong></td>
                        <td>{transaction.purchasePrice}$</td>
                    </tr>
                    <tr>
                        <td><strong>Aktulna cena:</strong></td>
                        <td>{transaction.currentPrice}$</td>
                    </tr>
                    <tr>
                        <td><strong>Wolumen:</strong></td>
                        <td>{transaction.quantity}</td>
                    </tr>
                    <tr>
                        <td><strong>Zysk %:</strong></td>
                        <td className={transaction.profitPercentage.includes('-') ? "loss" : "profit"}>
                            {transaction.profitPercentage}
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Anuluj</button>
                    <button className="btn-delete" onClick={onConfirm}>Usuń</button>
                </div>
            </div>
        </div>
    );
}
