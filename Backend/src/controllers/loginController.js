import turso from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const SECRET_KEY = process.env.JWT_SECRET;

export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ error: "Email y password son obligatorios" });
  }

  try {
    // Buscar usuario
    const result = await turso.execute({
      sql: "SELECT * FROM usuario WHERE email = ?",
      args: [email],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const usuario = result.rows[0];

    // Comparar contraseña
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Crear Access Token (corta duración)
    const accessToken = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, id_rol: usuario.id_rol },
      SECRET_KEY,
      { expiresIn: "15m" } // 15 minutos
    );

    // Crear Refresh Token (larga duración)
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Almacenar refresh token en la base de datos
    await turso.execute({
      sql: "INSERT INTO refresh_token (id_usuario, token, expires_at) VALUES (?, ?, ?)",
      args: [usuario.id_usuario, refreshToken, expiresAt.toISOString().slice(0, 19).replace('T', ' ')],
    });

    res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario.id_usuario,
        email: usuario.email,
        id_rol: usuario.id_rol,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};