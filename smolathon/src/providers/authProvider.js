import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access-token') ?? '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh-token') ?? '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (refreshToken) {
                console.log("Trying refresh");

                try {
                    const response = await axios.post("/token/refresh/", {
                        "refresh": refreshToken
                    });

                    setToken(response.data.access);
                    localStorage.setItem('access-token', response.data.access);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('access-token');
                    localStorage.removeItem('refresh-token');
                    setToken('');
                    setRefreshToken('');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const loginAction = async (data) => {
        try {
            const response = await axios.post('/token/', data);
            const res = response.data;

            setRefreshToken(res.refresh);
            setToken(res.access);

            localStorage.setItem("refresh-token", res.refresh);
            localStorage.setItem("access-token", res.access);

            return true;
        } catch (e) {
            console.log(`Error while trying to auth: ${e}`)
        }

        return false;
    }

    const logOut = () => {
        setUser(null);
        setToken('');
        setRefreshToken('');
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
    }

    return (
        <AuthContext.Provider value={{ token, refreshToken, user, loading, loginAction, logOut, isAuthentificated: !!token }}>
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