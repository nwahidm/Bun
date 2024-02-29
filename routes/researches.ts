import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createResearch, deleteResearch, fetchAllResearches, fetchResearchDetail, updateResearch } from "../controllers/researches"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllResearches)
router.post("/create", authMiddlewares, createResearch)
router.get("/:id", authMiddlewares, fetchResearchDetail)
router.put("/:id", authMiddlewares, updateResearch)
router.delete("/:id", authMiddlewares, deleteResearch)

export default router