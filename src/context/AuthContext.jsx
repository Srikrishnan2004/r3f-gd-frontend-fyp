import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("gd_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem("gd_user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await api.login(credentials);
        if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("gd_user", JSON.stringify(data.user));
            return data.user;
        }
        throw new Error(data.message || "Login failed");
    };

    const signup = async (userData) => {
        const data = await api.signup(userData);
        if (data.success && data.user) {
            // Auto login after signup? The requirement says signup flow then login. 
            // But usually modern apps auto login. 
            // The API returns the user, so let's log them in. 
            // Wait, if I look at the requirements "create a login and signup flow... also after successful login allow the user..."
            // I'll stick to returning the data so the UI can decide (e.g., redirect to login vs auto-login).
            // Actually, for better UX, I'll log them in if successful.
            setUser(data.user);
            localStorage.setItem("gd_user", JSON.stringify(data.user));
            return data.user;
        }
        throw new Error(data.message || "Signup failed");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("gd_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
