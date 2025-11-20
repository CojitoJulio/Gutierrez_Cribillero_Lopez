import { Router } from "express";
import { registroPremios, getPremios, getPremio, estadoPremio, updatePremio, createPremio } from "../controllers/adminController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// GET /api/canje/historial
router.get("/historial", verificarToken, registroPremios)

router.get("/premios", verificarToken, getPremios)

router.put("/estadoPremio", verificarToken, estadoPremio)

router.put("/premio", verificarToken, updatePremio)

router.post("/premio", verificarToken, createPremio)

router.get("/premiosolo", verificarToken, getPremio)



export default router;