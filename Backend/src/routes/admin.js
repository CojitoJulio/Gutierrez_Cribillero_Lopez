import { Router } from "express";
import { registroPremios, getPremios, getPremio, desactivarPremio, updatePremio, createPremio, activarPremio } from "../controllers/adminController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// GET /api/canje/historial
router.get("/historial", verificarToken, registroPremios)

router.get("/premios", verificarToken, getPremios)

router.put("/desactivarPremio", verificarToken, desactivarPremio)

router.put("/activarPremio", verificarToken, activarPremio)

router.put("/premio", verificarToken, updatePremio)

router.post("/premio", verificarToken, createPremio)

router.get("/premiosolo", verificarToken, getPremio)



export default router;