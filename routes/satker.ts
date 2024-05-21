import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createSatker, deleteSatker, fetchAllSatker, fetchSatkerDetail, updateSatker } from "../controllers/satker"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllSatker)
router.post("/create", authMiddlewares, createSatker)
router.get("/:id", authMiddlewares, fetchSatkerDetail)
router.put("/:id", authMiddlewares, updateSatker)
router.delete("/:id", authMiddlewares, deleteSatker)

export default router