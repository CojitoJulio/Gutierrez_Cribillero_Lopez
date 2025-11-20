import { Router } from "express";
import { canjearPremio, validarCanje, getpremios, verificarCanje, resumenCanje, registroPremios } from "../controllers/canjePremioController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// POST /api/canje/canjePremio
router.post("/canjePremio", verificarToken, canjearPremio);

// POST /api/canje/validar-canje
router.post("/validarCanje", verificarToken, validarCanje);

// GET /api/canje/premios
router.get("/premios", verificarToken, getpremios)

// POST /api/canje/verificarCanje
router.post("/verificarCanje", verificarToken, verificarCanje);

// GET /api/canje/resumen
router.post("/resumen", verificarToken, resumenCanje)



export default router;