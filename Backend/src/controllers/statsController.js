import turso from "../models/db.js";


export const getData = async (req, res) => {
    try {
        const StatsRes = await turso.execute({
            sql: `select r.id_reciclaje, u.nombre as usuario, s.nombre as sede, r.fecha, rm.cantidad, m.nombre as material, m.valor_punto
                    from reciclaje r
                    join reciclaje_material rm on r.id_reciclaje = rm.id_reciclaje
                    join material m on rm.id_material = m.id_material
                    join usuario u on r.id_usuario = u.id_usuario
                    join sede s on s.id_sede = r.id_sede
                    `,
            args: [],
        });

        res.status(200).json({ stats: StatsRes.rows });
    } catch (error) {
        console.error('Error al obtener la lista de premios:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener la lista de premios.' });
    }
};