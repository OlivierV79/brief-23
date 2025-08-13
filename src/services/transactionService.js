const API_BASE = 'http://localhost:8080/api/transactions';

export async function getTransactions(token) {
    const res = await fetch(API_BASE, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur lors du chargement des transactions');
    return res.json();
}

export async function createTransaction(token, transaction) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    });
    if (!res.ok) throw new Error('Erreur lors de la création de la transaction');
    return res.json();
}

export async function deleteTransaction(token, transactionId) {
    const res = await fetch(`${API_BASE}/${transactionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression de la transaction');
}

export async function updateTransaction(token, transactionId, transaction) {
    const res = await fetch(`${API_BASE}/${transactionId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour de la transaction');
    return res.json();
}
