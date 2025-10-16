import { Route, Routes, Navigate } from "react-router";
import LoginScreen from "@/auth/pages/Login";
import RegisterScreen from "@/auth/pages/Register";
import MainMenu from "@/features/MainMenu";
import HomePage from "@/features/home/Home";
import RewardsScreen from "@/features/rewards/rewards";
import { AuthProvider } from "@/auth/api/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import ProfileScreen from "@/features/profile/profileScreen";
import RedirectIfAuthenticated from "./RedirectIfAuthenticated";
import RecycleScreen from "@/features/recycle/recycleScreen";
import ResultsList from "@/features/recycle/listScreen";


export default function AppRouter() {
    const primary = "#00bfb3";
    const darkTeal = "#0a615c";
    const lightTeal = "#d7efee";
    return (
        <AuthProvider>
            <Routes>
                <Route path="/pruebacamara" element={<RecycleScreen />} />

                <Route element={<RedirectIfAuthenticated to="/" />}>
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/register" element={<RegisterScreen />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<MainMenu />}>
                        <Route index element={<HomePage primary={primary} darkTeal={darkTeal} lightTeal={lightTeal} />} />
                        <Route path="rewards" element={<RewardsScreen />} />
                        <Route path="/recycle" element={<RecycleScreen />} />
                        <Route path="/profile" element={<ProfileScreen />} />
                        <Route path="/list" element={<ResultsList />} />
                    </Route>
                </Route>

            </Routes>
        </AuthProvider>
    );
}
