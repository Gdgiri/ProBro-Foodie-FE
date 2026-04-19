import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import axios from 'axios';
import { User, Mail, Lock, Loader2, ChefHat } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
            dispatch(setCredentials(data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 animate-slide-up pb-20">
            <div className="card p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary-500 p-4 rounded-3xl mb-4 shadow-xl shadow-primary-500/20">
                        <ChefHat size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black">Join ProBro Foodie</h1>
                    <p className="text-slate-500 text-center">Start sharing your healthy recipes with the world!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input pl-12" 
                                placeholder="John Doe"
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input pl-12" 
                                placeholder="name@example.com"
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input pl-12" 
                                placeholder="Minimum 6 characters"
                                minLength={6}
                                required 
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-medium text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500">
                    Already have an account? {' '}
                    <Link to="/login" className="text-primary-500 font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
