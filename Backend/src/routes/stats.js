import { Router } from "express";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { getData } from "../controllers/statsController.js";

const router = Router();

// GET /api/stats/data
router.get("/data", verificarToken, getData)




export default router;