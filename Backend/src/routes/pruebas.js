import { Router } from "express";
import { getUsers } from "../controllers/pruebasTest.js";

const router = Router();


// GET /usuarios/getPerfil
router.get("/getUsers", getUsers);


export default router;