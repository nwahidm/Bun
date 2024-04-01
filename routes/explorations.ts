import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createExploration, deleteExploration, fetchAllExplorations, fetchExplorationDetail, updateExploration } from "../controllers/explorations"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllExplorations)
router.post("/create", authMiddlewares, createExploration)
router.get("/:id", authMiddlewares, fetchExplorationDetail)
router.put("/:id", authMiddlewares, updateExploration)
router.delete("/:id", authMiddlewares, deleteExploration)

export default router