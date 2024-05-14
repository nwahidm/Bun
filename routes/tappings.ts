import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createTapping, deleteTapping, fetchAllTappings, fetchTappingDetail, updateTapping } from "../controllers/tappings"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllTappings)
router.post("/create", authMiddlewares, createTapping)
router.get("/:id", authMiddlewares, fetchTappingDetail)
router.put("/:id", authMiddlewares, updateTapping)
router.delete("/:id", authMiddlewares, deleteTapping)

export default router