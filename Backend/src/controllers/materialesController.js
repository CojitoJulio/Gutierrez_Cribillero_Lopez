import turso from "../models/db.js";

export const obtenerMateriales = async (req, res) => {
    try {
        // Consulta para obtener todos los materiales
        const result = await turso.execute(`
      SELECT id_material, nombre, valor_punto
      FROM material
    `);

        // Retorna los datos en formato JSON
        res.status(200).json({
            mensaje: "Materiales obtenidos correctamente",
            materiales: result.rows,
        });
    } catch (error) {
        console.error("Error al obtener materiales:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener materiales",
        });
    }
};