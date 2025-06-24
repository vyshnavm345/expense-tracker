import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function ExpenseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expense, setExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        api.get(`expenses/${id}/`)
        .then(res => setExpense(res.data))
        .catch(() => setError('Could not load'))
        .finally(() => setLoading(false));
    }, [id]);

    const handleDeleteConfirm = async () => {
        await api.delete(`expenses/${id}/`);
        navigate('/dashboard');
    };

    if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    return (
        <div className="flex justify-center items-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">{expense.title}</h1>

            <div className="space-y-4 text-gray-700">
            <p><strong>💰 Amount:</strong> <span className="text-gray-900 font-medium">${expense.amount ? Number(expense.amount).toFixed(2) : '0.00'}</span></p>
            <p><strong>📂 Category:</strong> <span className="capitalize">{expense.category}</span></p>
            <p><strong>📅 Date:</strong> {expense.date}</p>
            <p><strong>📝 Notes:</strong> {expense.notes || '—'}</p>
            </div>

            <div className="mt-6 flex space-x-4 justify-end">
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => navigate(`/expense/${id}/edit`)}
            >
                Edit
            </button>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => setShowModal(true)}
            >
                Delete
            </button>
            </div>
        </div>

        {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-6">Are you sure you want to delete this expense?</p>
                <div className="flex justify-end space-x-4">
                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowModal(false)}
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={handleDeleteConfirm}
                >
                    Yes, Delete
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}
