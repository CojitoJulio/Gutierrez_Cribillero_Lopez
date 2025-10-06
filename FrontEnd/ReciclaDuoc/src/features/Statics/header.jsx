import ReciclajeIcon from "../../assets/Icons/ReciclajeIcon";
import UserIcon from "../../assets/Icons/UserIcon";
import { Link } from "react-router";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function Header({
    userFake = {
        nombre: "",
        email: "",
        avatarUrl: "",
    },
}) {

    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [err, setErr] = useState(null);

    const api = useMemo(
        () =>
            axios.create({
                baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
            }),
        []
    );

    const getProfile = async () => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const { data } = await api.get("/api/usuario/getPerfil", { headers });
        return data;
    };

    useEffect(() => {
        if (!token) {
            setLoading(false); // no hay token -> nada que pedir
            return;
        }
        (async () => {
            try {
                const data = await getProfile();
                setUser(data.perfil);
            } catch (e) {
                console.error("Error al obtener el perfil:", e);
                setErr(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const shownUser = user ?? userFake;

    const darkTeal = "#0a615c";
    return (
        <header className="px-4 pt-4 m-1">
            <div className="flex items-center justify-between">
                <ReciclajeIcon />
                <div className="flex items-center gap-2">
                    <div className="text-teal-900 font-semibold text-xl" style={{ color: darkTeal }}>{shownUser.nombre}</div>
                    <Link to={'/profile'}>
                        <UserIcon />
                    </Link>
                </div>
            </div>

            <h1 className="mt-2 text-[40px] leading-none font-extrabold" style={{ color: darkTeal }}>ReciclaDUOC</h1>
        </header>
    );
}
