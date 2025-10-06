import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(false);

    // Configurar instancia de Axios
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    });

    // Agregar token automáticamente a los headers
    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete api.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    // Función de inicio de sesión
    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await api.post("/api/usuario/loginUsuario", { email, password });
            const { token, usuario } = res.data;
            setUser(usuario);
            setToken(token);
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función de cierre de sesión
    const logout = () => {
        setUser(null);
        setToken(null);
    };

    // Comprobación inicial (si existe token)
    useEffect(() => {
        if (token) {
            try {
                // Opcional: decodificar el token para mostrar datos del usuario
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUser({ id: payload.id, email: payload.email });
            } catch {
                logout();
            }
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!token,
                login,
                logout,
                api, // expone axios configurado con el token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado
export const useAuth = () => useContext(AuthContext);
