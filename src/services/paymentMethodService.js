import PaymentMethodList from "../components/PaymentMethodList.jsx";

export async function getPaymentMethods(token) {
    const res = await fetch('http://localhost:8080/api/payment-methods', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Erreur lors du chargement des PaymentMethod');
    return res.json();
}

export async function createPaymentMethod(token, category) {
    const res = await fetch('http://localhost:8080/api/payment-methods', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Erreur lors de la création de la PaymentMethod');
    return res.json();
}

export async function deletePaymentMethod(token, categoryId) {
    const res = await fetch(`http://localhost:8080/api/payment-methods/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression de la PaymentMethod');
}