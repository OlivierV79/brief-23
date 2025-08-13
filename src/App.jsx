import React from 'react'
import './App.css'
import AuthForm from './components/AuthForm'
import { useAuth } from './contexts/AuthContext'
import CategoryList from "./components/CategoryList.jsx";
import Navbar from "./components/Navbar.jsx";
import {Route, Routes} from "react-router-dom";
import TransactionList from "./components/TransactionList.jsx";
import PaymentMethodList from "./components/PaymentMethodList.jsx";

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
            <Navbar />
            <div>
                <Routes>
                    <Route path="/" element={<TransactionList />} />
                    <Route path="/categories" element={<CategoryList />} />
                    <Route path="/payment-methods" element={<PaymentMethodList />} />
                </Routes>
            </div>
        </div>
    )
}

