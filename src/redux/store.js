import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from './storage';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'theme'], // Persist both auth and theme
};

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
