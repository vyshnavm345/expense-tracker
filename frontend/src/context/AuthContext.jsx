import { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setLoadingAuth(false);
            return;
        }

        try {
            const res = await api.get('auth/status/');
            setUser({ username: res.data.username, is_staff: res.data.is_staff });
        } catch (err) {
            console.warn('Auth restore failed:', err);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        } finally {
            setLoadingAuth(false);
        }
        };

        fetchUser();
    }, []);

    const login = async (username, password) => {
        const { data } = await api.post('token/', { username, password });

        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        const status = await api.get('auth/status/');
        const userData = { username: status.data.username, is_staff: status.data.is_staff };
        setUser(userData);

        if (userData.is_staff) {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        navigate('/login');
    };

    if (loadingAuth) {
        return null; // or a spinner/loading screen
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}
