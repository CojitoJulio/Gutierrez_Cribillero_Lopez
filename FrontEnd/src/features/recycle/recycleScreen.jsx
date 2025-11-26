import { useState } from "react";
import CameraCapture from "./cameraCapture";
import axios from "axios";
import { useRecycleStore } from "@/app/context/RecycleStore";
import { useTheme } from "@/app/context/ThemeContext";
import FloatingCharacter from "./floatingCharacter";


export default function RecycleScreen() {
    const [loading, setLoading] = useState(false);
    const [IAresponse, setIAresponse] = useState(null);
    const { addItem } = useRecycleStore();
    const { colors } = useTheme();

    const api2 = axios.create({
        baseURL: import.meta.env.IA_URL || "https://d18pk4pn-8000.use.devtunnels.ms/",
    });

    const uploadIA = async (imageBlobOrFile) => {
        setLoading(true);
        try {
            const form = new FormData();
            form.append("file", imageBlobOrFile, `photo_${Date.now()}.jpg`);
            const res = await api2.post("/classify", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setIAresponse(res.data);
        } finally {
            setLoading(false);
        }
    };

    const handleRetake = () => {
        setIAresponse(null);
    };

    // Helper para saber si hay resultado
    const hasResult = !!IAresponse;

    return (
        <div className="pb-6 px-4 relative h-screen overflow-hidden max-w-md mx-auto">

            <CameraCapture
                title="Capturar y Enviar Foto"
                initialFacingMode="environment"
                imageQuality={0.75}
                maxWidth={800}   // opcional
                maxHeight={800}  // opcional
                onCapture={(blob) => {
                    uploadIA(blob);
                }}
                takeData={{ IAresponse }}
                onRetake={handleRetake}
                onAdd={(item) => addItem(item)}
            />

            <div
                className={`transition-all duration-700 ease-in-out z-20 
                    ${hasResult
                        ? "fixed bottom-27 right-4 w-32"
                        : "fixed w-full flex justify-center mt-10 right-30 bottom-27"
                    }`}
            >
                <div
                    className={`
                        absolute bottom-[100%] right-0 mb-2 bg-white p-3 rounded-2xl shadow-xl border border-gray-200
                        transform transition-all duration-500 origin-bottom-right
                        ${hasResult ? "opacity-100 scale-100 translate-y-27 w-60 -translate-x-30" : "opacity-100 scale-100 translate-y-20 pointer-events-none left-65 w-60"}
                    `}
                >
                    {hasResult ? (
                        <>
                            <h3 className="font-bold text-lg text-gray-800 mb-1">¡Lo tengo!</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><span className="font-semibold text-teal-600">Material:</span> {IAresponse.topClass}</p>
                                <p><span className="font-semibold text-teal-600">Puntaje:</span> {IAresponse.score}</p>
                            </div>

                            <div className="absolute bottom-15 -right-2 w-4 h-4 bg-white border-t border-r border-gray-200 transform rotate-45"></div>
                        </>
                    ) : (
                        <>
                            <h3 className="font-bold text-lg text-gray-800 mb-1">{loading ? ("Pensando...") : ("¡Comienza a escanear!")}
                            </h3>
                            <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-b border-l border-gray-200 transform rotate-45"></div>
                        </>
                    )}
                </div>

                <div className={hasResult ? "w-full" : "w-[200px]"}>
                    <FloatingCharacter />
                </div>
            </div>
        </div>
    );
}