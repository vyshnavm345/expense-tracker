import { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [filters, setFilters] = useState({ category: '', start_date: '', end_date: '' });
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const categories = ['food', 'travel', 'utilities', 'misc'];

    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        const params = {};
        Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
        try {
            const res = await api.get('expenses/', { params });
            setExpenses(res.data);
        } catch (err) {
            setError('Failed to load expenses.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await api.get('expenses/summary/', { params: filters });
            setSummary(res.data);
        } catch (err) {
            console.error('Summary fetch failed', err);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchSummary();
    }, [filters]);

    return (
        <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="mb-4 space-x-4">
            <button className='p-3 font-bold border-green-600 border-2 rounded-2xl bg-green-500 text-white' onClick={()=>{navigate('/expense/new')}}>Add New Expense</button>
            <input
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters(f => ({ ...f, start_date: e.target.value }))}
            className="px-3 py-2 border rounded"
            />
            <input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters(f => ({ ...f, end_date: e.target.value }))}
            className="px-3 py-2 border rounded"
            />
            <select
            value={filters.category}
            onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
            className="px-3 py-2 border rounded"
            >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
            <p>Loading...</p>
        ) : (
            <table className="w-full mb-6 table-auto border-collapse">
            <thead>
                <tr>
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
                    <td className="border px-4 py-2">{exp.title}</td>
                    <td className="border px-4 py-2">{exp.amount}</td>
                    <td className="border px-4 py-2">{exp.category}</td>
                    <td className="border px-4 py-2">{exp.date}</td>
                    <td className="border px-4 py-2">
                    <Link className="text-blue-500 hover:underline" to={`/expense/${exp.id}`}>View</Link>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        {/* Summary Section */}
        <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Spend by Category</h2>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Left: Table */}
            <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr>
                    <th className="px-2 py-1">Category</th>
                    <th className="px-2 py-1">Total</th>
                </tr>
                </thead>
                <tbody>
                {summary.map(({ category, total }) => (
                    <tr key={category}>
                    <td className="border-t px-2 py-1">{category}</td>
                    <td className="border-t px-2 py-1">{total.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            {/* Right: Chart */}
            <div className="flex-1 flex justify-center items-center mt-1 lg:mt-0">
            <PieChart width={350} height={250}>
                <Pie
                data={summary}
                dataKey="total"
                nameKey="category"
                cx="50%" cy="50%"
                outerRadius={85}
                label
                >
                {summary.map((entry, i) => (
                    <Cell
                    key={entry.category}
                    fill={['#8884d8','#82ca9d','#ffc658','#ff8042'][i % 4]}
                    />
                ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
            </PieChart>
            </div>
        </div>
        </div>
    </div>
    );
}
