import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { useLocation } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [dietType, setDietType] = useState('None');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search') || '';

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/recipes`, {
                params: { search, category, dietType, page }
            });
            setRecipes(data.recipes);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [search, category, dietType, page]);

    const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
    const dietTypes = ['None', 'Vegan', 'Vegetarian', 'Keto', 'Paleo'];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden group">
                <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80" 
                    alt="Hero" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Find Your Favorite Recipes</h1>
                    <p className="text-slate-200 text-lg max-w-lg">Discover healthy and delicious meals tailored to your diet and lifestyle.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full md:pb-0 scrollbar-hide">
                    <div className="flex items-center gap-2 text-[var(--text-muted)] mr-2">
                        <SlidersHorizontal size={18} />
                        <span className="font-medium">Filter:</span>
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {setCategory(cat); setPage(1);}}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shadow-sm border ${
                                category === cat 
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 border-transparent' 
                                : 'bg-[var(--card-bg)] text-[var(--text-main)] border-[var(--card-border)] hover:border-primary-500'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <select 
                    value={dietType}
                    onChange={(e) => {setDietType(e.target.value); setPage(1);}}
                    className="w-full md:w-auto px-4 py-2.5 rounded-2xl bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--card-border)] outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium shadow-sm"
                >
                    {dietTypes.map(diet => (
                        <option key={diet} value={diet}>{diet} Diet</option>
                    ))}
                </select>
            </div>

            {/* Recipe Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="card h-80 animate-pulse bg-slate-200 dark:bg-slate-800 shadow-none border-none"></div>
                    ))}
                </div>
            ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <h3 className="text-2xl font-bold text-slate-400">No recipes found.</h3>
                    <p className="text-slate-500">Try searching for something else or changing filters.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-8">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="btn btn-secondary disabled:opacity-30"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                page === i + 1 
                                ? 'bg-primary-500 text-white shadow-lg' 
                                : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="btn btn-secondary disabled:opacity-30"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
