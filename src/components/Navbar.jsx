import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/themeSlice';
import {
  Sun,
  Moon,
  Menu,
  X,
  PlusSquare,
  User as UserIcon,
  LogOut,
  Search,
  ChefHat
} from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-500 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <ChefHat className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-orange-500 dark:from-primary-400 dark:to-orange-400">
              ProBro Foodie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary-500" size={18} />
            </form>

            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 hover:bg-[var(--input-bg)] border border-transparent hover:border-[var(--card-border)] rounded-xl transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/create" className="btn btn-primary flex items-center gap-2">
                  <PlusSquare size={18} />
                  <span>Create</span>
                </Link>
                <Link to="/profile" className="p-2 hover:bg-[var(--input-bg)] border border-transparent hover:border-[var(--card-border)] rounded-xl transition-all">
                  <UserIcon size={20} />
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-xl transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </form>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              {user ? (
                <>
                  <Link to="/create" className="btn btn-primary text-center">Create Recipe</Link>
                  <Link to="/profile" className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                    <UserIcon size={20} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => dispatch(logout())}
                    className="flex items-center gap-3 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-xl"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary text-center">Login</Link>
                  <Link to="/register" className="btn btn-primary text-center">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
