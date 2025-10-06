import Header from "./Statics/header";
import Navbar from "./Statics/navbar";
import { Outlet } from "react-router";

export default function MainMenu() {
    const darkTeal = "#0a615c";

    return (
        <div className="w-full grid place-items-center bg-neutral-100">
            {/* Marco del “teléfono” */}
            <div className="w-[380px] max-w-full h-dvh bg-white rounded-[28px] overflow-hidden">
                {/* 3 filas: header / contenido / nav */}
                <div className="grid h-full grid-rows-[auto_1fr_auto]">
                    {/* Fila 1: Header fijo */}
                    <div className="relative">
                        <Header darkTeal={darkTeal} />
                    </div>

                    {/* Fila 2: Contenido que cambia (Outlet) y scrollea */}
                    <main className="overflow-y-auto px-4 py-2">

                        <Outlet />
                    </main>

                    {/* Fila 3: Navbar fijo */}
                    <Navbar darkTeal={darkTeal} />
                </div>
            </div>
        </div>
    );
}

