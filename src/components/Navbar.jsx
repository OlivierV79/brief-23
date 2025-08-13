import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-title">Financial Tracker</Link>
            </div>

            <div className="navbar-menu">
                <Link to="/" className="navbar-link">Transactions</Link>
                <Link to="/categories" className="navbar-link">Categorys</Link>
                <Link to="/payment-methods" className="navbar-link">Payment Methods</Link>
            </div>

            <div className="navbar-right">
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
}
