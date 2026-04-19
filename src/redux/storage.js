// Custom storage bridge to fix Vite/Redux-Persist interop issues
const createStorage = () => {
    return {
        getItem: (key) => {
            return Promise.resolve(localStorage.getItem(key));
        },
        setItem: (key, value) => {
            return Promise.resolve(localStorage.setItem(key, value));
        },
        removeItem: (key) => {
            return Promise.resolve(localStorage.removeItem(key));
        },
    };
};

const storage = createStorage();

export default storage;
