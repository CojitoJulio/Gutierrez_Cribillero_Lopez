import express from "express";
import usuariosRoutes from "./routes/usuarios.js";
import reciclajeRoutes from "./routes/reciclaje.js";
import pruebas from "./routes/pruebas.js";
import 'dotenv/config';
import cors from "cors";

const FRONT_END = process.env.FRONT_END;

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: FRONT_END,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

// Rutas
app.use("/api/usuario", usuariosRoutes);
app.use("/api/reciclaje", reciclajeRoutes);
app.use("/api/pruebas", pruebas)


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});