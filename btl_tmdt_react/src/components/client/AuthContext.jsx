// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('userName');
        if (storedUser) {
            setUserName(storedUser);
        }
    }, []);

    const login = (name) => {
        localStorage.setItem('userName', name);
        setUserName(name);
    };

    const logout = () => {
        localStorage.removeItem('userName');
        setUserName(null);
    };

    return (
        <AuthContext.Provider value={{ userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
