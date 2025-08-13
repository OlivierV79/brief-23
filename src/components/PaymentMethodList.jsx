import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    getPaymentMethods,
    createPaymentMethod,
    deletePaymentMethod
} from '../services/paymentMethodService';
import './PaymentMethodList.css';

export default function PaymentMethodList() {
    const { token } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', lastDigits: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            getPaymentMethods(token)
                .then(setPaymentMethods)
                .catch(err => setError(err.message));
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createPaymentMethod(token, formData);
            const updated = await getPaymentMethods(token);
            setPaymentMethods(updated);
            setFormData({ name: '', lastDigits: '' });
            setShowForm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce moyen de paiement ?')) {
            try {
                await deletePaymentMethod(token, id);
                setPaymentMethods(paymentMethods.filter(m => m.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="payment-method-list">
            <h2>Moyens de paiement</h2>
            {error && <p className="error">{error}</p>}

            <button className="add-btn" onClick={() => setShowForm(true)}>+ Ajouter</button>

            {paymentMethods.length === 0 ? (
                <p>Aucun moyen de paiement pour l’instant.</p>
            ) : (
                <div className="payment-methods">
                    {paymentMethods.map(method => (
                        <div key={method.id} className="payment-method-item">
                            <div>
                                <strong>{method.name}</strong>
                                <div>**** **** **** {method.lastDigits}</div>
                            </div>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(method.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Nouveau moyen de paiement</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Nom"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="4 derniers chiffres"
                                value={formData.lastDigits}
                                pattern="\d{4}"
                                maxLength="4"
                                onChange={(e) => setFormData({ ...formData, lastDigits: e.target.value })}
                                required
                            />
                            <div className="form-actions">
                                <button type="submit">Créer</button>
                                <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
