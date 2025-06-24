import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function ExpenseCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', amount: '', category: 'food', date: '', notes: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const categories = ['food', 'travel', 'utilities', 'misc'];

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);

        // Basic validations
        if (!form.title.trim() || form.title.length < 3) {
            setError("Title must be at least 3 characters.");
            return;
        }

        const amount = parseFloat(form.amount);
        if (isNaN(amount) || amount <= 0) {
            setError("Amount must be a valid positive number.");
            return;
        }

        if (!form.date) {
            setError("Date is required.");
            return;
        }

        setSaving(true);
        try {
            await api.post('expenses/', {
                title: form.title.trim(),
                amount,
                category: form.category,
                date: form.date,
                notes: form.notes.trim(),
            });
            navigate('/dashboard');
        } catch (err) {
            setError("Failed to create expense.");
            setSaving(false);
        }
    };


    return (
        <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">New Expense</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
            >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
            <button
            type="submit"
            disabled={saving}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
            {saving ? 'Creating…' : 'Create Expense'}
            </button>
        </form>
        </div>
    );
}
