import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCategories, createCategory, deleteCategory } from '../services/categoryService';
import './CategoryList.css';

export default function CategoryList() {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        color: '#000000',
        limit: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            getCategories(token)
                .then(setCategories)
                .catch(err => setError(err.message));
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createCategory(token, formData);
            const updated = await getCategories(token);
            setCategories(updated);
            setFormData({ name: '', color: '#000000', limit: '' });
            setShowForm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
            try {
                await deleteCategory(token, id);
                setCategories(categories.filter(c => c.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="category-list">
            <h2>Category</h2>
            {error && <p className="error">{error}</p>}
            <button className="add-btn" onClick={() => setShowForm(true)}>+ Add</button>

            <div className="categories">
                {categories.map(cat => (
                    <div key={cat.id} className="category-item" style={{ backgroundColor: cat.color }}>
                        <div>
                            <strong>{cat.name}</strong>
                            {cat.limit && <div>Limit : {cat.limit} €</div>}
                        </div>
                        <button className="delete-btn" onClick={() => handleDelete(cat.id)}>🗑️</button>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Nouvelle catégorie</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Limite mensuelle (optionnel)"
                                value={formData.limit}
                                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                            />
                            <div className="form-actions">
                                <button type="submit">Create</button>
                                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
