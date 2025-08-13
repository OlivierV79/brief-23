// src/services/categoryService.js
export async function getCategories(token) {
    const res = await fetch('http://localhost:8080/api/categories', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
    return res.json();
}

export async function createCategory(token, category) {
    const res = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Erreur lors de la création de la catégorie');
    return res.json();
}

export async function deleteCategory(token, categoryId) {
    const res = await fetch(`http://localhost:8080/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression de la catégorie');
}
