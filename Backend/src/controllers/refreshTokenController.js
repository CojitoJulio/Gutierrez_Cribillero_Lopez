import turso from "../models/db.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const SECRET_KEY = process.env.JWT_SECRET;

export const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
    return res.status(401).json({ error: "Refresh token no proporcionado" });
  }

  try {
    // 1. Buscar el token en la base de datos
    const tokenResult = await turso.execute({
      sql: "SELECT * FROM refresh_token WHERE token = ?",
      args: [requestToken],
    });

    if (tokenResult.rows.length === 0) {
      return res.status(403).json({ error: "Refresh token inválido" });
    }

    const oldToken = tokenResult.rows[0];

    // 2. Verificar si el token ha expirado
    if (new Date(oldToken.expires_at) < new Date()) {
      // Opcional: Limpiar tokens expirados
      await turso.execute({
        sql: "DELETE FROM refresh_token WHERE id_refresh_token = ?",
        args: [oldToken.id_refresh_token],
      });
      return res.status(403).json({ error: "Refresh token expirado" });
    }

    // 3. Buscar la información del usuario
    const userResult = await turso.execute({
        sql: "SELECT * FROM usuario WHERE id_usuario = ?",
        args: [oldToken.id_usuario],
    });

    if (userResult.rows.length === 0) {
        return res.status(403).json({ error: "Usuario no encontrado" });
    }
    const usuario = userResult.rows[0];

    // 4. Invalidar el token de refresco usado (Token Rotation)
    await turso.execute({
      sql: "DELETE FROM refresh_token WHERE id_refresh_token = ?",
      args: [oldToken.id_refresh_token],
    });

    // 5. Crear un nuevo access token
    const newAccessToken = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, id_rol: usuario.id_rol },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    // 6. Crear y almacenar un nuevo refresh token
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    await turso.execute({
      sql: "INSERT INTO refresh_token (id_usuario, token, expires_at) VALUES (?, ?, ?)",
      args: [usuario.id_usuario, newRefreshToken, expiresAt.toISOString().slice(0, 19).replace('T', ' ')],
    });

    // 7. Enviar los nuevos tokens
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (error) {
    console.error("Error al refrescar el token:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
