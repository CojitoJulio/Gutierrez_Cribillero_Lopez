import { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function ProfileScreen({
    userFake = {
        nombre: "",
        email: "",
        avatarUrl: "",
    },
    points = 0,
    history = [
        { id: 1, date: "2025-10-05", action: "Plástico PET", amountKg: 1.2, points: 120 },
        { id: 2, date: "2025-10-03", action: "Papel/Cartón", amountKg: 2.0, points: 160 },
        { id: 3, date: "2025-09-28", action: "Vidrio", amountKg: 0.8, points: 80 },
    ],
    onChangePassword = () => alert("Cambiar contraseña"),
    onLogout = () => alert("Cerrar sesión"),
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
    const primary = "#00bfb3";

    return (
        <div className="pb-6">

            {/* Info principal */}
            <section className="flex items-center gap-4">
                <Avatar name={shownUser.nombre} url={shownUser.avatarUrl} />
                <div>
                    <div className="text-2xl font-extrabold" style={{ color: darkTeal }}>
                        {shownUser.nombre}
                    </div>
                    <div className="text-neutral-600">{shownUser.email}</div>
                </div>
            </section>

            {/* Puntaje + mini stats */}
            <section className="mt-5 grid grid-cols-3 gap-3">
                <Card>
                    <div className="text-sm text-neutral-600">Puntaje</div>
                    <div className="text-2xl font-extrabold" style={{ color: darkTeal }}>
                        {points.toLocaleString()} pts
                    </div>
                </Card>

                <Card>
                    <div className="text-sm text-neutral-600">Reciclajes</div>
                    <div className="text-2xl font-extrabold" style={{ color: darkTeal }}>
                        {history.length}
                    </div>
                </Card>

                <Card>
                    <div className="text-sm text-neutral-600">Kg Totales</div>
                    <div className="text-2xl font-extrabold" style={{ color: darkTeal }}>
                        {history.reduce((a, h) => a + (h.amountKg || 0), 0).toFixed(1)} kg
                    </div>
                </Card>
            </section>

            {/* Historial */}
            <section className="mt-6">
                <h2 className="text-2xl font-extrabold mb-3" style={{ color: darkTeal }}>
                    Historial de reciclaje
                </h2>

                {history.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-3">
                        {history.map((item) => (
                            <HistoryItem key={item.id} item={item} accent={primary} dark={darkTeal} />
                        ))}
                    </div>
                )}
            </section>

            {/* Acciones */}
            <section className="mt-6 grid grid-cols-1 gap-3">
                <button
                    onClick={onChangePassword}
                    className="w-full rounded-2xl py-3 font-bold text-white shadow-md active:scale-[.99] transition"
                    style={{ backgroundColor: primary }}
                >
                    Cambiar contraseña
                </button>
                <button
                    onClick={onLogout}
                    className="w-full rounded-2xl py-3 font-bold text-white shadow-md active:scale-[.99] transition"
                    style={{ backgroundColor: darkTeal }}
                >
                    Cerrar sesión
                </button>
            </section>
        </div>
    );
}

/* ========== Subcomponentes ========== */

function Avatar({ name = "U", url = "" }) {
    const darkTeal = "#0a615c";
    if (url) {
        return (
            <img
                src={url}
                alt={name}
                className="w-16 h-16 rounded-2xl object-cover border"
                style={{ borderColor: "#dfe7e6" }}
                draggable={false}
            />
        );
    }
    // Placeholder con inicial
    return (
        <div
            className="w-16 h-16 rounded-2xl grid place-items-center text-white font-extrabold"
            style={{ backgroundColor: darkTeal }}
        >
            {String(name).charAt(0).toUpperCase()}
        </div>
    );
}

function Card({ children }) {
    return <div className="rounded-2xl border px-4 py-3 bg-white">{children}</div>;
}

function EmptyState() {
    return (
        <div className="rounded-2xl border bg-white px-4 py-6 text-center text-neutral-600">
            Aún no tienes registros. ¡Empieza a reciclar para ver tu progreso aquí!
        </div>
    );
}

function HistoryItem({ item, accent = "#00bfb3", dark = "#0a615c" }) {
    return (
        <div className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3">
            <div className="flex items-center gap-3">
                <div
                    className="w-12 h-12 rounded-xl grid place-items-center"
                    style={{ backgroundColor: `${accent}22`, color: dark }}
                >
                    <LeafIcon />
                </div>
                <div>
                    <div className="font-extrabold" style={{ color: dark }}>
                        {item.action}
                    </div>
                    <div className="text-sm text-neutral-600">
                        {formatDate(item.date)} · {item.amountKg} kg
                    </div>
                </div>
            </div>
            <div className="font-bold" style={{ color: dark }}>
                +{item.points} pts
            </div>
        </div>
    );
}

/* ========== Utilidades / Iconos ========== */

function formatDate(isoDate) {
    try {
        const d = new Date(isoDate);
        return d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return isoDate;
    }
}

function LeafIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
            <path d="M19.5 3C13 3 7.5 6.5 5 12c2.5 1.5 6 .5 7.5-1-1 2-3 3.5-5.5 4 2 2 6 2 8.5 0 3-3 4-7.5 4-12z" />
        </svg>
    );
}
