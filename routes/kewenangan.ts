import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createKewenangan, fetchAllKewenangan } from "../controllers/kewenangan"
const router = express.Router()

router.get("/", authMiddlewares, fetchAllKewenangan)
router.post("/", authMiddlewares, createKewenangan)



export default router