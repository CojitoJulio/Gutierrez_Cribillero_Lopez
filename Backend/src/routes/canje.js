import { Router } from "express";
import { canjearPremio, validarCanje } from "../controllers/canjePremioController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// POST /api/canje/canjePremio
router.post("/canjePremio", verificarToken, canjearPremio);

// POST /api/canje/validar-canje
router.post("/validarCanje", verificarToken, validarCanje);

export default router;