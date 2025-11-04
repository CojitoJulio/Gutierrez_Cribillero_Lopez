import { Router } from "express";
import { crearReciclaje } from "../controllers/reciclajeController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { obtenerMateriales } from "../controllers/materialesController.js";

const router = Router();

// POST /reciclaje
router.post("/registroReciclaje", verificarToken, crearReciclaje);

// GET /materiales
router.get("/materiales", obtenerMateriales);

export default router;