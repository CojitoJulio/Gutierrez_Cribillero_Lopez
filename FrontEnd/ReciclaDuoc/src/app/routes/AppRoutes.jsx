import { Route, Routes, Navigate } from "react-router";
import LoginScreen from "@/auth/pages/Login";
import RegisterScreen from "@/auth/pages/Register";
import MainMenu from "@/features/MainMenu";
import HomePage from "@/features/home/Home";
import RewardsScreen from "@/features/rewards/rewards";
import { AuthProvider } from "@/auth/api/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import ProfileScreen from "@/features/profile/profileScreen";


export default function AppRouter() {
    const primary = "#00bfb3";
    const darkTeal = "#0a615c";
    const lightTeal = "#d7efee";
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<MainMenu />}>
                        <Route index element={<HomePage primary={primary} darkTeal={darkTeal} lightTeal={lightTeal} />} />
                        <Route path="rewards" element={<RewardsScreen />} />
                        <Route path="/profile" element={<ProfileScreen />} />
                    </Route>
                </Route>

            </Routes>
        </AuthProvider>
    );
}