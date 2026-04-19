import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { 
    User as UserIcon, 
    Settings, 
    Heart, 
    ChefHat, 
    Loader2,
    Grid,
    BookMarked
} from 'lucide-react';

const Profile = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my-recipes');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user's created recipes
                const resRecipes = await axios.get(`${API_URL}/recipes`, { params: { search: '', category: 'All' } });
                // Filter locally for simplicity, or we could have a specific endpoint
                const myRecipes = resRecipes.data.recipes.filter(r => r.userId?._id === user?._id);
                setRecipes(myRecipes);
                
                // Fetch profile with favorites populated
                const resProfile = await axios.get(`${API_URL}/auth/profile`);
                setFavorites(resProfile.data.favorites || []);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    if (!user) return <div className="text-center py-20">Please login to view profile</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-fade-in">
            {/* Profile Header */}
            <div className="relative">
                <div className="h-48 md:h-64 bg-gradient-to-r from-primary-500 to-orange-500 rounded-[3rem]"></div>
                <div className="absolute -bottom-16 left-8 md:left-12 flex flex-col md:flex-row items-end gap-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white dark:bg-slate-900 p-2 shadow-2xl">
                        <div className="w-full h-full rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-500">
                            <UserIcon size={64} />
                        </div>
                    </div>
                    <div className="pb-4 space-y-1">
                        <h1 className="text-3xl md:text-4xl font-black">{user.name}</h1>
                        <p className="text-slate-500 font-medium">{user.email}</p>
                    </div>
                </div>
                <div className="absolute -bottom-16 right-8 hidden md:flex items-center gap-3">
                    <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                    <button className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-primary-500 transition-all">
                        <Settings size={24} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-16">
                {[
                    { label: 'Recipes Created', value: recipes.length, icon: ChefHat, color: 'text-primary-500' },
                    { label: 'Favorites', value: favorites.length, icon: Heart, color: 'text-red-500' },
                    { label: 'Total Likes', value: recipes.reduce((acc, r) => acc + (r.likes?.length || 0), 0), icon: Heart, color: 'text-orange-500' },
                    { label: 'Comments', value: recipes.reduce((acc, r) => acc + (r.comments?.length || 0), 0), icon: BookMarked, color: 'text-blue-500' },
                ].map((stat, i) => (
                    <div key={i} className="card p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-black">{stat.value}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Tabs */}
            <div className="space-y-8">
                <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-1">
                    <button 
                        onClick={() => setActiveTab('my-recipes')}
                        className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'my-recipes' ? 'text-primary-500' : 'text-slate-400'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Grid size={18} />
                            My Recipes
                        </div>
                        {activeTab === 'my-recipes' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 rounded-full animate-fade-in"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('favorites')}
                        className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'favorites' ? 'text-primary-500' : 'text-slate-400'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Heart size={18} />
                            Favorites
                        </div>
                        {activeTab === 'favorites' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 rounded-full animate-fade-in"></div>}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary-500" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {(activeTab === 'my-recipes' ? recipes : favorites).map((recipe) => (
                            <RecipeCard key={recipe._id} recipe={recipe} />
                        ))}
                        {activeTab === 'my-recipes' && recipes.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-xl text-slate-400 font-bold">You haven't created any recipes yet.</p>
                            </div>
                        )}
                        {activeTab === 'favorites' && favorites.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-xl text-slate-400 font-bold">No favorite recipes yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
