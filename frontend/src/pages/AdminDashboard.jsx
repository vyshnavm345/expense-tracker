import { useState, useEffect } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function AdminDashboard() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState([]);
    const [userSummary, setUserSummary] = useState([]);
    const [filters, setFilters] = useState({ category: '', start_date: '', end_date: '' });
    const [error, setError] = useState(null);

    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        const params = {};
        Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
        try {
            const res = await api.get('expenses/', { params });
            setExpenses(res.data);
        } catch (err) {
            setError('Failed to fetch expenses.');
        } finally {
            setLoading(false);
        }
    };

        useEffect(() => {
            const fetchAll = async () => {
                setError(null);
                setLoading(true);
                try {
                    await fetchExpenses();
                    const [summaryRes, userSummaryRes] = await Promise.all([
                        api.get('expenses/summary/', { params: filters }),
                        api.get('expenses/user_summary/'),
                    ]);
                    setSummary(summaryRes.data);
                    setUserSummary(userSummaryRes.data);
                } catch (err) {
                    setError('Failed to fetch summary data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchAll();
        }, [filters]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            );
        }

    return (
        <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {/* Summary by Category */}
        <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Category-wise Summary</h2>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Summary Table */}
                <div className="w-full lg:w-1/2">
                <table className="w-full table-auto">
                    <thead>
                    <tr>
                        <th className="border px-4 py-2">Category</th>
                        <th className="border px-4 py-2">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {summary.map(s => (
                        <tr key={s.category}>
                        <td className="border px-4 py-2 capitalize">{s.category}</td>
                        <td className="border px-4 py-2">${s.total.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                {/* Pie Chart */}
                <div className="w-full lg:w-1/2 flex justify-center items-center">
                <PieChart width={300} height={300}>
                    <Pie
                    data={summary}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    >
                    {summary.map((_, i) => (
                        <Cell key={i} fill={['#4F46E5', '#10B981', '#F59E0B', '#EF4444'][i % 4]} />
                    ))}
                    </Pie>
                    <Tooltip formatter={value => `$${value.toFixed(2)}`} />
                    <Legend />
                </PieChart>
                </div>
            </div>
        </div>
        {/* User Summary */}
        <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">User-wise Total Spend</h2>
            <table className="w-full table-auto">
            <thead>
                <tr>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Total Spent</th>
                </tr>
            </thead>
            <tbody>
                {userSummary.map(s => (
                <tr key={s.user__username}>
                    <td className="border px-4 py-2">{s.user__username}</td>
                    <td className="border px-4 py-2">${s.total.toFixed(2)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
            <input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters(f => ({ ...f, start_date: e.target.value }))}
                className="border px-3 py-2 rounded"
            />
            <input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters(f => ({ ...f, end_date: e.target.value }))}
                className="border px-3 py-2 rounded"
            />
            <select
                value={filters.category}
                onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                className="border px-3 py-2 rounded"
            >
                <option value="">All Categories</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="utilities">Utilities</option>
                <option value="misc">Misc</option>
            </select>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={fetchExpenses}
            >
                Apply Filters
            </button>
        </div>
        {/* All Expenses */}
        <h2 className="text-2xl font-semibold mb-4">All Expenses</h2>
        <table className="w-full table-auto border-collapse">
            <thead>
            <tr>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {expenses.map(exp => (
                <tr key={exp.id}>
                <td className="border px-4 py-2">{exp.user}</td>
                <td className="border px-4 py-2">{exp.title}</td>
                <td className="border px-4 py-2">${Number(exp.amount).toFixed(2)}</td>
                <td className="border px-4 py-2 capitalize">{exp.category}</td>
                <td className="border px-4 py-2">{exp.date}</td>
                <td className="border px-4 py-2">
                    <Link className="text-blue-500 hover:underline" to={`/expense/${exp.id}`}>View</Link>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}
