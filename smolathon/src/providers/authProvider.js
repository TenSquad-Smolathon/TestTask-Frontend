import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') ?? '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    // Verify token with backend
                    const response = await fetch('/api/verify-token/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        // Token is invalid
                        localStorage.removeItem('token');
                        setToken('');
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                    setToken('');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const loginAction = async (data) => {
        try {
            const response = await axios.post('/api/login', data);
            const res = response.data;

            if (res.success) {
                setToken(res.token);
                localStorage.setItem("token", res.token);
            }
        } catch (e) {
            console.log(`Error while trying to auth: ${e}`)
        }
    }

    const registerAction = async (userData) => {
        try {
            const response = await fetch('/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const res = await response.json();

            if (res.success) {
                setToken(res.token);
                setUser(res.user);
                localStorage.setItem('token', res.token);
                return { success: true };
            } else {
                return { success: false, error: res.message };
            }
        } catch (err) {
            console.error('Registration error:', err);
            return { success: false, error: 'Network error' };
        }
    };

    const logOut = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{ token, user, loading, loginAction, registerAction, logOut, isAuthentificated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}