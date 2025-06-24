import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
                ExpenseTracker
            </Link>
            {user && (
                <span className="text-gray-700">
                Welcome, <strong>{user.username}</strong>
                </span>
            )}
            </div>
            <div className="space-x-4">
            {!user ? (
                <>
                <Link to="/login" className="text-gray-600 hover:text-gray-800">
                    Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-gray-800">
                    Register
                </Link>
                </>
            ) : (
                <>
                <Link
                    to={user.is_staff ? "/admin" : "/dashboard"}
                    className="text-gray-600 hover:text-gray-800"
                    >
                    Dashboard
                </Link>

                <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
                </>
            )}
            </div>
        </div>
        </nav>
    );
}
