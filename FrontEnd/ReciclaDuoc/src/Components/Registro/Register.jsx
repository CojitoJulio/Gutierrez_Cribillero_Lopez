
export default function RegisterScreen() {
    const darkTeal = "#0a615c";
    const accent = "#00bfb3";

    return (
        <div className="w-full min-h-screen grid place-items-center bg-neutral-100 p-4">
            {/* Phone frame */}
            <div className="w-[380px] max-w-full bg-white rounded-[28px] shadow-2xl border border-neutral-200 overflow-hidden">
                <div className="px-6 pt-10 pb-10">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <RecycleLogo accent={accent} dark={darkTeal} />
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

                        <p className="mt-4 text-center text-lg text-neutral-800">o Iniciar Sesion</p>
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

function RecycleLogo({ accent = "#00bfb3", dark = "#0a615c" }) {
    return (
        <svg viewBox="0 0 64 64" className="w-20 h-20" aria-hidden>
            {/* Simple abstract recycle-like mark with two tones */}
            <path d="M28 7l5 9-5 3-5-9z" fill={accent} />
            <path d="M49 17l-9 5-3-5 9-5z" fill={dark} />
            <path d="M53 40l-10-3 2-5 10 3z" fill={accent} />
            <path d="M30 56l-5-9 5-3 5 9z" fill={dark} />
            <path d="M11 47l9-5 3 5-9 5z" fill={accent} />
            <path d="M9 24l10 3-2 5-10-3z" fill={dark} />
        </svg>
    );
}