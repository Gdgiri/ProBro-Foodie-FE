import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Flame, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';

const RecipeCard = ({ recipe }) => {
    const { user } = useSelector(state => state.auth);
    const hasLiked = recipe.likes?.includes(user?._id);
    return (
        <Link to={`/recipe/${recipe._id}`} className="card group">
            <div className="relative h-48 sm:h-56 overflow-hidden">
                <img 
                    src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80'} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--card-border)] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                    <Flame size={16} className="text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-[var(--text-main)]">{recipe.calories || 0} kcal</span>
                </div>
                {recipe.dietType && recipe.dietType !== 'None' && (
                    <div className="absolute top-4 left-4 bg-primary-500 px-3 py-1.5 rounded-xl shadow-lg">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{recipe.dietType}</span>
                    </div>
                )}
            </div>
            
            <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary-500 transition-colors line-clamp-2">
                        {recipe.title}
                    </h3>
                </div>

                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span>{recipe.category || 'Lunch'}</span>
                    </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-[var(--card-border)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                            {recipe.userId?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-medium text-[var(--text-main)] opacity-80">
                            {recipe.userId?.name || 'User'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 transition-colors ${hasLiked ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                            <Heart size={16} className={hasLiked ? 'fill-red-500' : ''} />
                            <span className="text-xs">{recipe.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[var(--text-muted)]">
                            <MessageCircle size={16} />
                            <span className="text-xs">{recipe.comments?.length || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
