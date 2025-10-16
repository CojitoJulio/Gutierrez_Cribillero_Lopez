import { useMemo } from "react";
import { useRecycleStore } from "@/app/context/RecycleStore";
import { Link } from "react-router";

// Utilidad para formatear %
const fmtPct = (v) => (typeof v === "number" ? `${(v * 100).toFixed(1)}%` : v);


// Un item de la lista
function ResultItem({ item, onRemove }) {
    // Si viene Blob/Base64, intenta crear URL seguro
    const imgSrc = useMemo(() => {
        if (!item?.photo) return "";
        if (typeof item.photo === "string") return item.photo; // url/base64
        try {
            return URL.createObjectURL(item.photo); // Blob/File
        } catch {
            return "";
        }
    }, [item?.photo]);

    return (
        <li className="flex items-center gap-3 p-3 rounded-xl border bg-white shadow-sm">
            {/* Miniatura */}
            <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border">
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={item.material || "foto"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full grid place-content-center text-xs text-gray-400">
                        Sin foto
                    </div>
                )}
            </div>

            {/* Datos */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                        {item.ia.topClass || "Material desconocido"}
                    </h3>
                    {/* Puntaje pill */}
                    <span className="shrink-0 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                        style={{ backgroundColor: "#e6f3f2", color: "#0a615c", border: "1px solid #bfe3e0" }}>
                        Puntaje: {item.ia.score ?? "-"}
                    </span>
                </div>

                <div className="text-sm text-gray-600">
                    <span className="font-medium">Confianza: </span>
                    {typeof item.ia.confidence === "number" && item.ia.confidence <= 1
                        ? fmtPct(item.ia.confidence)
                        : item.ia.confidence ?? "-"}
                </div>

                {/* Opcional: detalles secundarios */}
                {item.extra && (
                    <div className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {item.extra}
                    </div>
                )}
            </div>

            {/* Quitar */}
            {onRemove && (
                <button
                    onClick={() => onRemove(item.id)}
                    className="ml-2 rounded-lg px-3 py-2 text-xs border hover:bg-gray-50"
                    aria-label="Eliminar"
                    title="Eliminar"
                >
                    Eliminar
                </button>
            )}
        </li>
    );
}

/**
 * Lista de resultados
 * items: Array<{id, image, material, confianza, puntaje, extra?}>
 */
export default function ResultsList() {

    const darkTeal = "#0a615c";
    const lightTeal = "#d7efee";

    const { items, removeItem } = useRecycleStore();

    if (!items.length) {
        return (
            <>
                <div className="p-4 rounded-xl border bg-gray-50 text-sm text-gray-600">
                    Aún no hay fotos clasificadas. Toma una y presiona “Enviar”.

                </div>
                <Link to="/recycle">
                    <button className="rounded-xl px-4 py-3 flex-1 w-full mt-4"
                        style={{ backgroundColor: lightTeal, color: darkTeal }}>
                        Agregar
                    </button>
                </Link>
            </>
        );
    }

    return (
        <ul className="space-y-3">
            {items.map((it) => (
                <ResultItem key={it.id} item={it} onRemove={removeItem} />
            ))}

            <Link to="/recycle">
                <button className="rounded-xl px-4 py-3 flex-1 w-full mt-4"
                    style={{ backgroundColor: lightTeal, color: darkTeal }}>
                    Agregar más
                </button>
            </Link>
        </ul>
    );
}
