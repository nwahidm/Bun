import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { addPlan, createExploration, deleteExploration, fetchAllExplorations, fetchExplorationDetail, updateExploration } from "../controllers/explorations"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllExplorations)
router.post("/create", authMiddlewares, createExploration)
router.get("/:id", authMiddlewares, fetchExplorationDetail)
router.put("/:id", authMiddlewares, updateExploration)
router.delete("/:id", authMiddlewares, deleteExploration)
router.post("/:id/plan", authMiddlewares, addPlan)

export default router