export default function HomePage({ primary, darkTeal, lightTeal }) {

    return (
        <div className="px-6 pb-6">

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