import React from 'react'
import './App.css'
import AuthForm from './components/AuthForm'
import { useAuth } from './contexts/AuthContext'

export default function App() {
    const { isAuthenticated, username, logout } = useAuth()

    if (!isAuthenticated) {
        return (
            <div className="app-shell">
                <h1>Financial Tracker</h1>
                <AuthForm />
            </div>
        )
    }

    return (
        <div className="app-shell">
            <header className="app-header">
                <h1>Financial Tracker</h1>
                <div className="user-zone">
                    <span>Utilisateur{username ? ` : ${username}` : ''}</span>
                    <button onClick={logout} className="logout-btn">Se déconnecter</button>
                </div>
            </header>

            <main>

                <p>Bienvenue dans Financial Tracker Pro +++ </p>
            </main>
        </div>
    )
}

