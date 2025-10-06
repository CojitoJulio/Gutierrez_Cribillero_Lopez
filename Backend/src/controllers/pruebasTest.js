import turso from "../models/db.js";
const SECRET_KEY = process.env.JWT_SECRET;

export const getUsers = async (req, res) => {

    try {
        // Buscar usuario
        const result = await turso.execute({
            sql: "SELECT * FROM usuario"
        });

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "No hay users" });
        }

        const usuario = result.rows[0];

        res.status(200).json(result);
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};