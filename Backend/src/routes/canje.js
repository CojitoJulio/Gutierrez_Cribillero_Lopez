import { Router } from "express";
import { canjearPremio } from "../controllers/canjePremioController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// POST /api/canje
router.post("/canjePremio", verificarToken, canjearPremio);

export default router;