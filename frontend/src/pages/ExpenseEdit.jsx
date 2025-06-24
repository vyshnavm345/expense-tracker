import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function ExpenseEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [form, setForm] = useState({
        title: '',
        amount: '',
        category: 'food',
        date: '',
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [loadError, setLoadError] = useState(null);  // NEW
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        api.get(`expenses/${id}/`)
        .then(res => {
            const { title, amount, category, date, notes } = res.data;
            setForm({ title, amount: amount.toString(), category, date, notes });
        })
        .catch(() => setLoadError('Failed to load expense.'))  // CHANGED
        .finally(() => setLoading(false));
    }, [id]);


    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setFormError(null);  // CHANGED

        if (!form.title.trim() || form.title.length < 3) {
            setFormError("Title must be at least 3 characters.");
            return;
        }

        const amount = parseFloat(form.amount);
        if (isNaN(amount) || amount <= 0) {
            setFormError("Amount must be a valid positive number.");
            return;
        }

        if (!form.date) {
            setFormError("Date is required.");
            return;
        }

        setSaving(true);
        try {
            await api.put(`expenses/${id}/`, {
                title: form.title.trim(),
                amount,
                category: form.category,
                date: form.date,
                notes: form.notes.trim(),
            });
            navigate(user?.is_staff ? '/admin' : '/dashboard');
        } catch (err) {
            setFormError('Update failed.');
            setSaving(false);
        }
    };



    if (loading) return <p>Loading...</p>;
    if (loadError) return <p className="text-red-500">{loadError}</p>;

    return (
        <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Expense</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block mb-1">Title</label>
            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
            />
            </div>
            <div>
            <label className="block mb-1">Amount</label>
            <input
                name="amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
            />
            </div>
            <div>
            <label className="block mb-1">Category</label>
            <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
            >
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="utilities">Utilities</option>
                <option value="misc">Miscellaneous</option>
            </select>
            </div>
            <div>
            <label className="block mb-1">Date</label>
            <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
            />
            </div>
            <div>
            <label className="block mb-1">Notes</label>
            <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
            />
            </div>
            {formError && <p className="text-red-500">{formError}</p>}
            <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
            {saving ? 'Saving…' : 'Save Changes'}
            </button>
        </form>
        </div>
    );
}
