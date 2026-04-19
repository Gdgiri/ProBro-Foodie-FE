import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        darkMode: true, // Standard for ProBro Foodie
    },
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
        },
        setTheme: (state, action) => {
            state.darkMode = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
