// src/auth/RedirectIfAuthenticated.jsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/auth/api/AuthContext";

export default function RedirectIfAuthenticated({ to = "/" }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    // Si ya hay sesión, redirige (y reemplaza el history para que no vuelvas con Back)
    return isAuthenticated
        ? <Navigate to={location.state?.from?.pathname || to} replace />
        : <Outlet />;
}
