import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Heart, 
    MessageCircle, 
    Flame, 
    Clock, 
    Share2, 
    ThumbsUp, 
    ThumbsDown,
    ChevronRight,
    Loader2,
    Calendar,
    Send,
    Edit3,
    Trash2
} from 'lucide-react';
import { useSelector } from 'react-redux';

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [interactionLoading, setInteractionLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchRecipe = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/recipes/${id}`);
            setRecipe(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recipe:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const handleInteraction = async (action) => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        setInteractionLoading(true);
        try {
            if (action === 'favorite') {
                const { data } = await axios.put(`${API_URL}/auth/favorite/${id}`);
                setRecipe({ ...recipe, isFavorited: data.includes(id) });
            } else {
                const { data } = await axios.put(`${API_URL}/recipes/${id}/interaction`, { action });
                setRecipe({ ...recipe, likes: data.likes, dislikes: data.dislikes });
            }
            setInteractionLoading(false);
        } catch (error) {
            console.error('Interaction error:', error);
            setInteractionLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!comment.trim()) return;

        setSubmittingComment(true);
        try {
            const { data } = await axios.post(`${API_URL}/recipes/${id}/comments`, { text: comment });
            setRecipe({ ...recipe, comments: data });
            setComment('');
            setSubmittingComment(false);
        } catch (error) {
            console.error('Comment error:', error);
            setSubmittingComment(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: recipe.title,
            text: `Check out this amazing ${recipe.title} recipe on ProBro Foodie!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.log('Share failed:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) return;
        
        try {
            await axios.delete(`${API_URL}/recipes/${id}`);
            navigate('/');
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete recipe. ' + (err.response?.data?.message || ''));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary-500" size={48} />
            </div>
        );
    }

    if (!recipe) {
        return <div className="text-center py-20 text-2xl font-bold">Recipe not found</div>;
    }

    const hasLiked = recipe.likes?.includes(user?._id);
    const hasDisliked = recipe.dislikes?.includes(user?._id);

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-fade-in">
            {/* Header Section */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none h-64 sm:h-96 lg:h-[30rem]">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="space-y-6">
                    <div className="flex gap-2">
                        <span className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary-500/20">
                            {recipe.category}
                        </span>
                        {recipe.dietType && recipe.dietType !== 'None' && (
                            <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                {recipe.dietType}
                            </span>
                        )}
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] leading-tight">
                        {recipe.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                                {recipe.userId?.name?.charAt(0)}
                            </div>
                            <span>By {recipe.userId?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="card bg-orange-500 text-white p-6 border-none flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1">Total Calories</p>
                                <p className="text-3xl font-black">{recipe.calories} kcal</p>
                            </div>
                            <Flame size={32} className="text-white/30" />
                        </div>
                        
                        <div className="card p-4 sm:p-6 border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 overflow-hidden">
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleInteraction('like')}
                                    disabled={interactionLoading}
                                    className={`flex flex-col items-center gap-1 transition-all ${hasLiked ? 'text-primary-500' : 'text-slate-400 hover:text-primary-500'}`}
                                >
                                    <ThumbsUp size={24} className={hasLiked ? 'fill-primary-500' : ''} />
                                    <span className="text-xs font-bold">{recipe.likes?.length || 0}</span>
                                </button>
                                <button 
                                    onClick={() => handleInteraction('dislike')}
                                    disabled={interactionLoading}
                                    className={`flex flex-col items-center gap-1 transition-all ${hasDisliked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                                >
                                    <ThumbsDown size={24} className={hasDisliked ? 'fill-red-500' : ''} />
                                    <span className="text-xs font-bold">{recipe.dislikes?.length || 0}</span>
                                </button>
                                <button 
                                    onClick={() => handleInteraction('favorite')}
                                    disabled={interactionLoading}
                                    className={`flex flex-col items-center gap-1 transition-all ${recipe.isFavorited ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'}`}
                                >
                                    <Heart size={24} className={recipe.isFavorited ? 'fill-pink-500' : ''} />
                                    <span className="text-xs font-bold">Save</span>
                                </button>
                            </div>
                                <button onClick={handleShare} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 p-3.5 sm:p-4 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-500/10 border border-indigo-100 dark:border-indigo-800/30 flex-shrink-0">
                                    <Share2 size={24} />
                                </button>
                        </div>
                    </div>

                    {/* Owner Actions */}
                    {user && recipe.userId?._id === user._id && (
                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={() => navigate(`/edit-recipe/${id}`)}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 dark:bg-slate-700 text-white rounded-3xl font-black transition-all hover:bg-slate-900 dark:hover:bg-slate-600 hover:-translate-y-1 shadow-xl"
                            >
                                <Edit3 size={20} />
                                <span>Edit Recipe</span>
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-500/10 text-red-500 border-2 border-red-500/20 rounded-3xl font-black transition-all hover:bg-red-500 hover:text-white hover:-translate-y-1"
                            >
                                <Trash2 size={20} />
                                <span className="hidden sm:inline">Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                {/* Ingredients */}
                <div className="md:col-span-1 space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                        Ingredients
                    </h3>
                    <ul className="space-y-4">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-center gap-3 group">
                                <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center shrink-0 group-hover:bg-primary-500 transition-all">
                                    <ChevronRight size={14} className="text-primary-500 group-hover:text-white" />
                                </div>
                                <span className="text-[var(--text-main)] font-medium">{ing}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Preparation Steps */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
                        Instructions
                    </h3>
                    <div className="space-y-8">
                        {recipe.steps.map((step, idx) => (
                            <div key={idx} className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-primary-500 shrink-0 border border-slate-200 dark:border-slate-700">
                                        {idx + 1}
                                    </div>
                                    {idx !== recipe.steps.length - 1 && (
                                        <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 my-2"></div>
                                    )}
                                </div>
                                <p className="text-[var(--text-main)] text-lg leading-relaxed pt-1">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="pt-12 border-t border-slate-100 dark:border-slate-800 space-y-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                    <MessageCircle size={24} className="text-primary-500" />
                    Community Comments ({recipe.comments?.length || 0})
                </h3>

                {user ? (
                    <form onSubmit={handleAddComment} className="relative">
                        <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts on this recipe..."
                            className="input min-h-[120px] pr-16"
                        />
                        <button 
                            type="submit"
                            disabled={submittingComment || !comment.trim()}
                            className="absolute bottom-4 right-4 p-3 bg-primary-500 text-white rounded-2xl shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50"
                        >
                            {submittingComment ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                        </button>
                    </form>
                ) : (
                    <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-[2rem] text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 mb-4">You must be logged in to leave a comment.</p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary">Login Now</button>
                    </div>
                )}

                <div className="space-y-6">
                    {recipe.comments?.map((c, idx) => (
                        <div key={idx} className="flex gap-4 p-6 bg-[var(--card-bg)] rounded-[2rem] shadow-sm border border-[var(--card-border)] animate-fade-in">
                            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center font-bold text-primary-500 shrink-0">
                                {c.name?.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[var(--text-main)]">{c.name}</span>
                                    <span className="text-xs text-[var(--text-muted)] font-medium">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[var(--text-main)] opacity-80 leading-relaxed">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;
