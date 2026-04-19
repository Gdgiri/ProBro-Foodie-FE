import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
