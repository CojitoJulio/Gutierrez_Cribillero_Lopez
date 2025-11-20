import turso from "../models/db.js";
import { randomUUID } from "crypto";

export const canjearPremio = async (req, res) => {
  const { id_premio } = req.body;
  const { id: id_usuario } = req.usuario;

  if (!id_premio) {
    return res.status(400).json({ error: 'El id_premio es requerido.' });
  }

  let tx;
  try {
    // Iniciar transacción
    tx = await turso.transaction("write");

    const [usuarioRes, premioRes, estadoRes] = await Promise.all([
      tx.execute({ sql: "SELECT puntos FROM usuario WHERE id_usuario = ?", args: [id_usuario] }),
      tx.execute({ sql: "SELECT puntos_requeridos, stock FROM premio WHERE id_premio = ?", args: [id_premio] }),
      tx.execute({ sql: "SELECT id_estado FROM estado_canje WHERE nombre = 'Canjeado'" })
    ]);

    if (usuarioRes.rows.length === 0) {
      await tx.rollback();
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    if (premioRes.rows.length === 0) {
      await tx.rollback();
      return res.status(404).json({ error: 'Premio no encontrado.' });
    }
    if (estadoRes.rows.length === 0) {
      await tx.rollback();
      return res.status(500).json({ error: 'Estado por defecto no encontrado.' });
    }

    const puntosUsuario = usuarioRes.rows[0].puntos;
    const puntosRequeridos = premioRes.rows[0].puntos_requeridos;
    const stockPremio = premioRes.rows[0].stock;
    const idEstadoCanjeado = estadoRes.rows[0].id_estado;

    // 2. Verificar si hay stock y si el usuario tiene puntos suficientes
    if (stockPremio <= 0) {
      await tx.rollback();
      return res.status(200).json({ error: 'No hay stock disponible para este premio.' });
    }

    if (puntosUsuario < puntosRequeridos) {
      await tx.rollback();
      return res.status(200).json({ error: 'Puntos insuficientes para canjear el premio.' });
    }

    // 3. Generar UUID y actualizar tablas
    const nuevoCanjeId = randomUUID();
    const nuevosPuntos = puntosUsuario - puntosRequeridos;
    const nuevoStock = stockPremio - 1;
    const fechaActual = new Date().toISOString();

    await Promise.all([
      // Actualizar puntos del usuario
      tx.execute({
        sql: "UPDATE usuario SET puntos = ? WHERE id_usuario = ?",
        args: [nuevosPuntos, id_usuario]
      }),
      // Actualizar stock del premio
      tx.execute({
        sql: "UPDATE premio SET stock = ? WHERE id_premio = ?",
        args: [nuevoStock, id_premio]
      }),
      // Insertar el nuevo canje
      tx.execute({
        sql: "INSERT INTO canje_premio (id_canje, id_usuario, id_premio, id_estado, fecha) VALUES (?, ?, ?, ?, ?)",
        args: [nuevoCanjeId, id_usuario, id_premio, idEstadoCanjeado, fechaActual]
      })
    ]);

    // Confirmar transacción
    await tx.commit();

    // 4. Devolver el UUID del canje
    res.status(201).json({ id_canje: nuevoCanjeId });

  } catch (error) {
    if (tx) await tx.rollback();
    console.error('Error al canjear el premio:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar el canje.' });
  }
};

// Validar el canje de un premio por su UUID
export const validarCanje = async (req, res) => {
  const { uuid } = req.body;

  if (!uuid) {
    return res.status(400).json({ error: 'El código UUID es requerido.' });
  }

  let tx;
  try {
    tx = await turso.transaction("write");

    const canjeRes = await tx.execute({
      sql: `
        SELECT cp.id_estado, ec.nombre as estado_nombre
        FROM canje_premio cp
        JOIN estado_canje ec ON cp.id_estado = ec.id_estado
        WHERE cp.id_canje = ?
      `,
      args: [uuid],
    });

    if (canjeRes.rows.length === 0) {
      await tx.rollback();
      return res.status(404).json({ error: 'El código no es válido.' });
    }

    const { id_estado: idEstadoActual, estado_nombre: estadoNombreActual } = canjeRes.rows[0];
    let estadoNombreNuevo = estadoNombreActual;

    if (estadoNombreActual === 'Canjeado') {
      const estadoEntregadoRes = await tx.execute({
        sql: "SELECT id_estado FROM estado_canje WHERE nombre = 'Entregado'",
        args: [],
      });

      if (estadoEntregadoRes.rows.length === 0) {
        await tx.rollback();
        return res.status(500).json({ error: 'Estado "Entregado" no encontrado en la base de datos.' });
      }

      const idEstadoEntregado = estadoEntregadoRes.rows[0].id_estado;

      await tx.execute({
        sql: "UPDATE canje_premio SET id_estado = ? WHERE id_canje = ?",
        args: [idEstadoEntregado, uuid],
      });
      estadoNombreNuevo = 'Entregado';
      await tx.commit();
      return res.status(200).json({
        mensaje: 'El premio ha sido marcado como entregado.',
        estado_anterior: estadoNombreActual,
        estado_actual: estadoNombreNuevo,
      });
    } else if (estadoNombreActual === 'Entregado') {
      await tx.rollback();
      return res.status(200).json({
        mensaje: 'El premio ya fue entregado.',
        estado_actual: estadoNombreNuevo,
      });
    } else {
      // Para otros estados como 'Cancelado'
      await tx.rollback();
      return res.status(400).json({
        mensaje: `El canje se encuentra en estado: ${estadoNombreActual}.`,
        estado_actual: estadoNombreNuevo,
      });
    }

  } catch (error) {
    if (tx) await tx.rollback();
    console.error('Error al validar y actualizar el canje:', error);
    res.status(500).json({ error: 'Error interno del servidor al validar el canje.' });
  }
};

export const getpremios = async (req, res) => {
  try {
    const premiosRes = await turso.execute({
      sql: "SELECT id_premio, nombre, foto, puntos_requeridos, stock FROM premio where disponible = 1",
      args: [],
    });

    res.status(200).json({ premios: premiosRes.rows });
  } catch (error) {
    console.error('Error al obtener la lista de premios:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener la lista de premios.' });
  }
};

export const verificarCanje = async (req, res) => {
  const { id_premio } = req.body;
  const { id: id_usuario } = req.usuario;

  try {
    const canjeRes = await turso.execute({
      sql: `
        select id_canje from canje_premio where id_usuario = ? and id_premio = ? and id_estado = 1`,
      args: [id_usuario, id_premio],
    });

    if (canjeRes.rows.length === 0) {
      return res.status(200).json({});
    }

    res.status(200).json(canjeRes.rows[0]);
  } catch (error) {
    console.error('Error al obtener la lista de premios:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener la lista de premios.' });
  }
};

export const resumenCanje = async (req, res) => {
  const { id_canje } = req.body;
  try {
    const resumenRes = await turso.execute({
      sql: `
        select cp.id_canje, p.foto, p.nombre as premio, cp.fecha, p.puntos_requeridos, p.stock, u.nombre, u.puntos, ec.nombre as estado
        from canje_premio as cp 
        join premio as p on cp.id_premio = p.id_premio
        join usuario as u on cp.id_usuario = u.id_usuario
        join estado_canje as ec on cp.id_estado = ec.id_estado
        where cp.id_canje = ?`,
      args: [id_canje],
    });

    if (resumenRes.rows.length === 0) {
      return res.status(200).json({ "error": "ID de canje no encontrado" });
    }
    res.status(200).json(resumenRes.rows[0]);

  } catch (error) {
    console.error('Error al obtener el resumen del canje:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el resumen del canje.' });
  }
};

export const registroPremios = async (req, res) => {
  try {
    const premiosRes = await turso.execute({
      sql: `
        select cp.id_canje, p.foto, p.nombre as premio, cp.fecha, p.puntos_requeridos, p.stock, u.nombre, u.puntos, ec.nombre as estado
        from canje_premio as cp 
        join premio as p on cp.id_premio = p.id_premio
        join usuario as u on cp.id_usuario = u.id_usuario
        join estado_canje as ec on cp.id_estado = ec.id_estado`,
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