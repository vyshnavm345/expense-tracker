import { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ username: '', password: '', password2: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);

        if (!form.username.trim() || !form.password || !form.password2) {
        setError("All fields are required.");
        return;
        }

        if (form.username.trim().length < 3) {
        setError("Username must be at least 3 characters.");
        return;
        }

        if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
        }

        if (form.password !== form.password2) {
        setError("Passwords do not match.");
        return;
        }

        setLoading(true);
        try {
        await api.post('auth/register/', {
            username: form.username.trim(),
            password: form.password,
            password2: form.password2,
        });
        navigate('/login');
        } catch (err) {
        const msg =
            err.response?.data?.username?.[0] ||
            err.response?.data?.detail ||
            "Registration failed.";
        setError(msg);
        setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-6 text-center font-bold">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
                name="username"
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={form.username}
                onChange={handleChange}
                disabled={loading}
                required
            />
            </div>
            <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
                name="password"
                type="password"
                className="w-full px-3 py-2 border rounded"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
            />
            </div>
            <div className="mb-6">
            <label className="block mb-1">Confirm Password</label>
            <input
                name="password2"
                type="password"
                className="w-full px-3 py-2 border rounded"
                value={form.password2}
                onChange={handleChange}
                disabled={loading}
                required
            />
            </div>
            <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={loading}
            >
            {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="mt-4 text-center text-sm">
            Already have an account? <Link className="text-blue-500" to="/login">Login</Link>
            </p>
        </form>
        </div>
    );
}
