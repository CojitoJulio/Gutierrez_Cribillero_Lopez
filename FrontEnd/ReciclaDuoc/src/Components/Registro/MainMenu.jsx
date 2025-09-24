
export default function MainMenu() {
    const primary = "#00bfb3";
    const darkTeal = "#0a615c";
    const lightTeal = "#d7efee";

    return (
        <div className="w-full min-h-screen grid place-items-center bg-neutral-100">
            {/* Phone frame */}
            <div className="relative w-[380px] max-w-full bg-white rounded-[28px] shadow-2xl border border-neutral-200 overflow-hidden">
                {/* Status bar spacer */}
                <div className="h-6" />

                {/* Screen content */}
                <div className="px-6 pb-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="text-teal-900 font-semibold text-xl" style={{ color: darkTeal }}>Josefa</div>
                    </div>

                    {/* App title */}
                    <h1 className="mt-4 text-[40px] leading-none font-extrabold" style={{ color: darkTeal }}>ReciclaDUOC</h1>

                    {/* Primary button */}
                    <button
                        className="mt-6 w-full rounded-2xl py-4 text-white text-2xl font-bold shadow-md active:scale-[.99] transition"
                        style={{ backgroundColor: primary }}
                    >
                        Reciclar
                    </button>

                    {/* Points */}
                    <div className="mt-6 text-center">
                        <div className="text-3xl font-extrabold" style={{ color: darkTeal }}>750 puntos</div>
                    </div>

                    {/* Secondary actions */}
                    <button
                        className="mt-4 w-full rounded-2xl py-4 text-xl font-bold"
                        style={{ backgroundColor: lightTeal, color: darkTeal }}
                    >
                        Ganar Puntos
                    </button>

                    <button
                        className="mt-4 w-full rounded-2xl py-4 text-xl font-extrabold text-white"
                        style={{ backgroundColor: darkTeal }}
                    >
                        Canjear Premios
                    </button>

                    {/* Ranking card */}
                    <div className="mt-6">
                        <div className="text-3xl font-extrabold" style={{ color: darkTeal }}>Ranking</div>

                        <div className="mt-3 divide-y divide-neutral-200 border-y border-neutral-200">
                            <RankRow place={1} name="Maria" points={1200} />
                            <RankRow place={2} name="Javier" points={950} />
                            <RankRow place={3} name="Camila" points={800} />
                        </div>
                    </div>
                </div>

                {/* Bottom nav */}
                <div className="sticky bottom-0 w-full">
                    <div className="mx-4 mb-4 rounded-2xl" style={{ backgroundColor: darkTeal }}>
                        <div className="flex items-center justify-around py-3">
                            <NavIcon label="Inicio" active>
                                <HomeIcon />
                            </NavIcon>
                            <NavIcon label="Estadísticas">
                                <ChartIcon />
                            </NavIcon>
                            <NavIcon label="Agregar">
                                <PlusIcon />
                            </NavIcon>
                            <NavIcon label="Premios">
                                <TrophyIcon />
                            </NavIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RankRow({ place, name, points }) {
    const medals = {
        1: { bg: "bg-yellow-400", emoji: "🥇" },
        2: { bg: "bg-gray-300", emoji: "🥈" },
        3: { bg: "bg-amber-500", emoji: "🥉" },
    };
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                <div className={`w-7 h-7 grid place-items-center rounded-md text-sm ${medals[place].bg}`}>{place}</div>
                <div className="text-xl font-semibold text-neutral-800">{name}</div>
            </div>
            <div className="text-xl font-bold text-neutral-900">
                {points.toLocaleString()} <span className="font-semibold text-neutral-600">pts</span>
            </div>
        </div>
    );
}

function NavIcon({ children, label, active = false }) {
    return (
        <div className="flex flex-col items-center gap-1 text-white/90">
            <div className={`w-12 h-12 rounded-2xl grid place-items-center ${active ? "bg-white/15" : ""}`}>{children}</div>
            <span className="text-xs">{label}</span>
        </div>
    );
}





function HomeIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M5 9h3v10H5zM10.5 5h3v14h-3zM16 12h3v7h-3z" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
        </svg>
    );
}

function TrophyIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M5 4h14v3h2v3a5 5 0 01-5 5h-1a5 5 0 01-4 0H9a5 5 0 01-5-5V7h1V4zm2 7a3 3 0 003 3h4a3 3 0 003-3V7H7v4zm4 7h2v2H11z" />
        </svg>
    );
}