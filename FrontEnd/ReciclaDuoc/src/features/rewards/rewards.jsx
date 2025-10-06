import BagIcon from "@icons/bag.png";
import NotebookIcon from "@icons/notebook.png";
import BottleIcon from "@icons/bottle.png";


export default function RewardsScreen() {
    const darkTeal = "#0a615c";
    const cardBg = "#e9fbf8"; // verde muy claro
    const iconBg = "#d6f4f0";

    return (
        <div className="pb-6">

            <p className="mt-2 text-lg font-bold" style={{ color: darkTeal }}>
                <strong className="text-2xl">750</strong> Puntos disponibles
            </p>

            {/* Sección Premios */}
            <h2 className="mt-6 text-3xl font-extrabold" style={{ color: darkTeal }}>
                Premios
            </h2>

            <div className="mt-4 space-y-4">
                <RewardItem
                    icon={BottleIcon}
                    title="Botella reutilizable"
                    points={1200}
                    cardBg={cardBg}
                    iconBg={iconBg}
                    dark={darkTeal}
                />
                <RewardItem
                    icon={BagIcon}
                    title="Bolsa de tela"
                    points={1000}
                    cardBg={cardBg}
                    iconBg={iconBg}
                    dark={darkTeal}
                />
                <RewardItem
                    icon={NotebookIcon}
                    title="Cuaderno reciclado"
                    points={800}
                    cardBg={cardBg}
                    iconBg={iconBg}
                    dark={darkTeal}
                />
            </div>
        </div>
    );
}

function RewardItem({ icon, title, points, cardBg, iconBg, dark }) {
    return (
        <div
            className="flex items-center gap-4 rounded-3xl p-5"
            style={{ backgroundColor: cardBg }}
        >
            <div
                className="w-16 h-16 rounded-2xl grid place-items-center shrink-0"
                style={{ backgroundColor: iconBg, color: dark }}
            >
                {/* Ícono */}
                <div className="w-8 h-8 flex items-center justify-center">
                    <img src={icon} alt="" />
                </div>
            </div>

            <div>
                <div className="text-xl font-extrabold" style={{ color: dark }}>
                    {title}
                </div>
                <div className="text-xl font-bold text-neutral-700">
                    {points.toLocaleString()} pts
                </div>
            </div>
        </div>
    );
}
