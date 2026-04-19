import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, 
    Trash2, 
    Image as ImageIcon, 
    Flame, 
    Loader2, 
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';

const CreateRecipe = () => {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Lunch');
    const [dietType, setDietType] = useState('None');
    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [calories, setCalories] = useState(0);
    
    const [isUploading, setIsUploading] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError('');
        
        try {
            const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            if (!CLOUD_NAME || !UPLOAD_PRESET) {
                throw new Error('Cloudinary configuration missing in .env');
            }

            // 1. Upload to Cloudinary directly using Unsigned Preset
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Cloudinary upload failed');
            }

            const resData = await response.json();
            setImageUrl(resData.secure_url);
            setIsUploading(false);
        } catch (err) {
            console.error('Cloudinary Upload Error:', err);
            setError(err.message || 'Failed to upload image. Please check your Cloudinary settings.');
            setIsUploading(false);
        }
    };

    const handleAddIngredient = () => setIngredients([...ingredients, '']);
    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };
    const handleRemoveIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const handleAddStep = () => setSteps([...steps, '']);
    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };
    const handleRemoveStep = (index) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index));
        }
    };

    const handleCalculateCalories = async () => {
        const filteredIngredients = ingredients.filter(i => i.trim() !== '');
        if (filteredIngredients.length === 0) {
            setError('Please add some ingredients first');
            return;
        }

        setIsCalculating(true);
        setError('');

        try {
            const { data } = await axios.post(`${API_URL}/recipes/calories`, { ingredients: filteredIngredients });
            setCalories(data.calories);
            setIsCalculating(false);
        } catch (err) {
            console.error('Calorie Calculation Error:', err);
            setError('Failed to calculate calories. Make sure ingredients are descriptive (e.g., "100g Chicken").');
            setIsCalculating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title || !imageUrl || ingredients.some(i => !i.trim()) || steps.some(s => !s.trim())) {
            setError('Please fill all fields and upload an image');
            return;
        }

        setIsSubmitting(true);

        try {
            await axios.post(`${API_URL}/recipes`, {
                title,
                category,
                dietType,
                ingredients: ingredients.filter(i => i.trim()),
                steps: steps.filter(s => s.trim()),
                image: imageUrl,
                calories
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create recipe');
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <AlertCircle size={48} className="text-orange-500 mb-4" />
                <h2 className="text-2xl font-bold mb-4">You need to be logged in to create recipes</h2>
                <button onClick={() => navigate('/login')} className="btn btn-primary">Login Now</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-slide-up pb-20">
            <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-orange-500">
                Share Your Recipe
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload Area */}
                <div className="relative group">
                    <div className={`
                        aspect-video rounded-[3rem] border-4 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all
                        ${imageUrl ? 'border-transparent' : 'border-[var(--card-border)] bg-[var(--input-bg)]'}
                    `}>
                        {imageUrl ? (
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-primary-500 p-6 rounded-full text-white shadow-lg shadow-primary-500/20">
                                    {isUploading ? <Loader2 size={40} className="animate-spin" /> : <ImageIcon size={40} />}
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg text-[var(--text-main)]">Upload food photo</p>
                                    <p className="text-slate-500 text-sm">JPG, PNG or WEBP (Max 5MB)</p>
                                </div>
                            </div>
                        )}
                        <input 
                            type="file" 
                            onChange={handleImageChange} 
                            disabled={isUploading}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    {imageUrl && (
                        <button 
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="absolute top-6 right-6 p-3 bg-red-500 text-white rounded-full shadow-xl hover:rotate-90 transition-transform"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-500 flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Recipe Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input text-xl font-bold" 
                                placeholder="Give your dish a name"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Category</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="input"
                                >
                                    {['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Diet Type</label>
                                <select 
                                    value={dietType}
                                    onChange={(e) => setDietType(e.target.value)}
                                    className="input"
                                >
                                    {['None', 'Vegan', 'Vegetarian', 'Keto', 'Paleo'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="card p-6 bg-gradient-to-br from-orange-500 to-primary-500 text-white border-none relative overflow-hidden">
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 font-bold text-sm uppercase tracking-wider mb-1">AI Nutrition Power</p>
                                    <h3 className="text-3xl font-black">{calories} kcal</h3>
                                </div>
                                <button 
                                    type="button"
                                    onClick={handleCalculateCalories}
                                    disabled={isCalculating}
                                    className="px-6 py-3 bg-white text-orange-600 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                                >
                                    {isCalculating ? <Loader2 size={18} className="animate-spin" /> : <Flame size={18} />}
                                    <span>{calories > 0 ? 'Recalculate' : 'Analyze'}</span>
                                </button>
                            </div>
                            <Flame className="absolute -bottom-10 -right-10 text-white/10 w-40 h-40 transform -rotate-12" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ingredients</label>
                                <button 
                                    type="button" 
                                    onClick={handleAddIngredient}
                                    className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all shadow-md shadow-primary-500/20"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {ingredients.map((ing, idx) => (
                                    <div key={idx} className="flex gap-2 animate-fade-in">
                                        <input 
                                            value={ing}
                                            onChange={(e) => handleIngredientChange(idx, e.target.value)}
                                            className="input py-2.5" 
                                            placeholder={`Ingredient ${idx + 1}`}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveIngredient(idx)}
                                            className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Cooking Steps</label>
                                <button 
                                    type="button" 
                                    onClick={handleAddStep}
                                    className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all shadow-md shadow-primary-500/20"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-2 animate-fade-in items-start">
                                        <span className="bg-[var(--input-bg)] border border-[var(--card-border)] w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-[var(--text-main)] shrink-0">
                                            {idx + 1}
                                        </span>
                                        <textarea 
                                            value={step}
                                            onChange={(e) => handleStepChange(idx, e.target.value)}
                                            className="input py-2.5 min-h-[50px] resize-none" 
                                            placeholder={`Step ${idx + 1}`}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveStep(idx)}
                                            className="p-2.5 text-slate-400 hover:text-red-500 transition-colors pt-3"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-10">
                    <button type="button" onClick={() => navigate('/')} className="btn btn-secondary px-8 py-4">Cancel</button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || isUploading}
                        className="btn btn-primary px-12 py-4 flex items-center gap-3 text-lg"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                        <span>Publish Recipe</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRecipe;
