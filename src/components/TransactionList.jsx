import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from '../services/transactionService';
import { getCategories } from '../services/categoryService';
import { getPaymentMethods } from '../services/paymentMethodService';
import './TransactionList.css';

export default function TransactionList() {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        paymentMethodId: ''
    });

    useEffect(() => {
        if (token) {
            Promise.all([
                getTransactions(token),
                getCategories(token),
                getPaymentMethods(token)
            ])
                .then(([txData, catData, pmData]) => {
                    setTransactions(txData);
                    setCategories(catData);
                    setPaymentMethods(pmData);
                })
                .catch(err => setError(err.message));
        }
    }, [token]);

    const refreshTransactions = () => {
        getTransactions(token).then(setTransactions).catch(err => setError(err.message));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                ...formData,
                amount: Number(formData.amount),
                categoryId: Number(formData.categoryId),
                paymentMethodId: Number(formData.paymentMethodId)
            };

            if (editMode) {
                await updateTransaction(token, editId, payload);
            } else {
                await createTransaction(token, payload);
            }

            refreshTransactions();
            setShowForm(false);
            setEditMode(false);
            setEditId(null);
            setFormData({
                title: '',
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                categoryId: '',
                paymentMethodId: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (tx) => {
        setFormData({
            title: tx.title,
            description: tx.description,
            amount: tx.amount,
            date: tx.date.substring(0, 10),
            categoryId: tx.categoryId,
            paymentMethodId: tx.paymentMethodId
        });
        setEditMode(true);
        setEditId(tx.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette transaction ?')) {
            try {
                await deleteTransaction(token, id);
                refreshTransactions();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const formatAmount = (amount) => {
        return Number(amount).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const groupedTransactions = transactions.reduce((groups, tx) => {
        const date = tx.date.substring(0, 10);
        if (!groups[date]) groups[date] = [];
        groups[date].push(tx);
        return groups;
    }, {});

    const getCategoryColor = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.color : '#ccc';
    };

    return (
        <div className="transaction-list">
            <h2>Transactions</h2>
            {error && <p className="error">{error}</p>}
            <button className="add-btn" onClick={() => { setShowForm(true); setEditMode(false); }}>+ Ajouter</button>

            {transactions.length === 0 ? (
                <p>Aucune transaction pour l’instant.</p>
            ) : (
                Object.entries(groupedTransactions).map(([date, txList]) => (
                    <div key={date} className="date-group">
                        <h3>{date}</h3>
                        {txList.map(tx => (
                            <div key={tx.id} className="transaction-item" style={{ backgroundColor: tx.categoryColor || getCategoryColor(tx.categoryId) }}>

                                <div className="transaction-content">
                                    <div className="transaction-title">{tx.id}</div>
                                    <div className="transaction-title">{tx.title}</div>
                                    <div className="transaction-title">{tx.categoryId}</div>
                                    <div className="transaction-amount">{formatAmount(tx.amount)} €</div>
                                </div>
                                <div className="transaction-actions">
                                    <button onClick={() => handleEdit(tx)}>✏️</button>
                                    <button onClick={() => handleDelete(tx.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{editMode ? 'Modifier la transaction' : 'Nouvelle transaction'}</h3>
                        {paymentMethods.length === 0 && (
                            <p className="error">Ajoutez un moyen de paiement avant de créer une transaction.</p>
                        )}
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Titre"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Montant"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <select
                                value={formData.paymentMethodId}
                                onChange={(e) => setFormData({ ...formData, paymentMethodId: e.target.value })}
                                required
                            >
                                <option value="">Sélectionner un moyen de paiement</option>
                                {paymentMethods.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} (**** {m.lastDigits})
                                    </option>
                                ))}
                            </select>
                            <div className="form-actions">
                                <button type="submit" disabled={paymentMethods.length === 0}>
                                    {editMode ? 'Mettre à jour' : 'Créer'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
