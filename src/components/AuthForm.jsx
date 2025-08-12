// src/components/AuthForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css';

export default function AuthForm() {
    const { login } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        const url = isRegister
            ? 'http://localhost:8080/api/auth/register'
            : 'http://localhost:8080/api/auth/login';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Erreur lors de la requête');
            }

            const data = await response.json();

            if (isRegister) {
                setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                setIsRegister(false);
            } else {
                if (data.accessToken) {
                    login(data.accessToken);
                } else {
                    throw new Error('accessToken manquant dans la réponse');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isRegister ? 'Inscription' : 'Connexion'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'En cours...' : isRegister ? "S'inscrire" : 'Se connecter'}
                </button>
            </form>

            <p className="toggle-text">
                {isRegister ? 'Déjà un compte ?' : "Pas encore de compte ?"}{' '}
                <button
                    type="button"
                    onClick={() => {
                        setIsRegister(!isRegister);
                        setError('');
                        setSuccessMessage('');
                    }}
                    className="toggle-btn"
                >
                    {isRegister ? 'Se connecter' : "S'inscrire"}
                </button>
            </p>
        </div>
    );
}
