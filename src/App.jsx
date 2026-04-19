import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/Profile';
import EditRecipe from './pages/EditRecipe';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  const darkMode = useSelector(state => state.theme.darkMode);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
