import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username.trim() || !password.trim()) {
        setError("Both username and password are required.");
        return;
        }
        if (username.length < 3 || password.length < 3) {
        setError("Username and password must be at least 3 characters.");
        return;
        }

        setLoading(true);
        try {
        await login(username.trim(), password.trim());
        } catch (err) {
        setError('Invalid credentials');
        setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-6 text-center font-bold">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
            />
            </div>
            <div className="mb-6">
            <label className="block mb-1">Password</label>
            <input
                type="password"
                className="w-full px-3 py-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
            />
            </div>
            <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
            >
            {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
        </div>
    );
}
