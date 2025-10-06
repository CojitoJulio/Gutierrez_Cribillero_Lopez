import ReciclajeIcon from '@icons/ReciclajeIcon'
import { Link } from 'react-router';

export default function RegisterScreen() {
    const darkTeal = "#0a615c";
    const accent = "#00bfb3";

    return (
        <div className="w-full min-h-screen grid place-items-center bg-neutral-100">
            {/* Phone frame */}
            <div className="w-[380px] max-w-full bg-white rounded-[28px] shadow-2xl border border-neutral-200 overflow-hidden">
                <div className="px-6 pt-10 pb-10">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <ReciclajeIcon />
                    </div>

                    {/* Title */}
                    <h1 className="mt-4 text-center text-[44px] leading-none font-extrabold" style={{ color: darkTeal }}>
                        ReciclaDUOC
                    </h1>

                    {/* Form */}
                    <form className="mt-6">
                        <InputField placeholder="Correo electrónico" accent={accent} />
                        <InputField placeholder="Contraseña" type="password" className="mt-4" accent={accent} />
                        <InputField placeholder="Confirmar contraseña" type="password" className="mt-4" accent={accent} />

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-2xl py-4 text-white text-2xl font-extrabold shadow-md active:scale-[.99] transition"
                            style={{ backgroundColor: darkTeal }}
                        >
                            Registrarse
                        </button>

                        <Link to={'/login'}>
                            <p className="mt-4 text-center text-lg text-neutral-800">o Iniciar Sesion</p>
                        </Link>

                    </form>
                </div>
            </div>
        </div>
    );
}

function InputField({ placeholder, type = "text", className = "", accent = "#00bfb3" }) {
    return (
        <div className={className}>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full rounded-2xl border px-5 py-4 text-lg outline-none bg-white"
                style={{ borderColor: accent }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}22`)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                aria-label={placeholder}
            />
        </div>
    );
}

