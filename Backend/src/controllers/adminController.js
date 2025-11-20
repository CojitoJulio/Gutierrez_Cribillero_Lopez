import turso from "../models/db.js";

// Historial Premios

export const registroPremios = async (req, res) => {
    try {
        const premiosRes = await turso.execute({
            sql: `
        select cp.id_canje, p.foto, p.nombre as premio, cp.fecha, p.puntos_requeridos, p.stock, u.nombre, u.puntos, ec.nombre as estado
        from canje_premio as cp 
        join premio as p on cp.id_premio = p.id_premio
        join usuario as u on cp.id_usuario = u.id_usuario
        join estado_canje as ec on cp.id_estado = ec.id_estado
        order by cp.fecha desc`,
            args: [],
        });

        if (premiosRes.rows.length === 0) {
            return res.status(200).json({ "mensaje": "No se encontraron datos" });
        }
        res.status(200).json({ premios: premiosRes.rows });

    } catch (error) {
        console.error('Error al obtener el historial de premios:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener el historial de premios.' });
    }
};

// Obtener Premios

export const getPremios = async (req, res) => {
    try {
        const premiosRes = await turso.execute({
            sql: "SELECT id_premio, nombre, foto, puntos_requeridos, stock, disponible FROM premio",
            args: [],
        });

        res.status(200).json({ premios: premiosRes.rows });
    } catch (error) {
        console.error('Error al obtener la lista de premios:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener la lista de premios.' });
    }
};

// Obtener Premio Solo

export const getPremio = async (req, res) => {

    const { id_premio } = req.query;

    if (!id_premio) {
        return res.status(400).json({ error: "El ID del premio es requerido." });
    }

    try {
        const premiosRes = await turso.execute({
            sql: "SELECT id_premio, nombre, foto, puntos_requeridos, stock, disponible FROM premio where id_premio = ?",
            args: [id_premio],
        });

        res.status(200).json(premiosRes.rows[0]);
    } catch (error) {
        console.error('Error al obtener la lista de premios:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener la lista de premios.' });
    }
};

// Estado del Premio

export const estadoPremio = async (req, res) => {
    const { id_premio, estado } = req.body;

    if (!id_premio) {
        return res.status(400).json({ error: "El ID del premio es requerido." });
    }

    try {
        const result = await turso.execute({
            sql: "UPDATE premio set disponible = ? WHERE id_premio = ?",
            args: [estado, id_premio],
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Premio no encontrado." });
        }

        res.status(200).json({ mensaje: "Premio desactivado correctamente." });
    } catch (error) {
        console.error('Error al eliminar el premio:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el premio.' });
    }
};


// Actualizar Premio

export const updatePremio = async (req, res) => {
    const { id_premio, nombre, puntos_requeridos, stock } = req.body;

    if (!id_premio || !nombre || !puntos_requeridos || stock === undefined || stock === null) {
        return res.status(400).json({ error: "Todos los campos son obligatorios para actualizar el premio." });
    }

    try {
        const result = await turso.execute({
            sql: "UPDATE premio SET nombre = ?, puntos_requeridos = ?, stock = ? WHERE id_premio = ?",
            args: [nombre, puntos_requeridos, stock, id_premio],
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Premio no encontrado." });
        }

        res.status(200).json({ mensaje: "Premio actualizado correctamente." });
    } catch (error) {
        console.error('Error al actualizar el premio:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el premio.' });
    }
};

// Crear Premio

export const createPremio = async (req, res) => {
    const { nombre, puntos_requeridos, stock } = req.body;

    if (!nombre || !puntos_requeridos || stock === undefined || stock === null) {
        return res.status(400).json({ error: "Todos los campos son obligatorios para crear un premio." });
    }

    try {
        const result = await turso.execute({
            sql: "INSERT INTO premio (nombre, puntos_requeridos, stock) VALUES (?, ?, ?)",
            args: [nombre, puntos_requeridos, stock],
        });

        res.status(201).json({ mensaje: "Premio creado correctamente.", id_premio: Number(result.lastInsertRowid) });
    } catch (error) {
        console.error('Error al crear el premio:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear el premio.' });
    }
};
