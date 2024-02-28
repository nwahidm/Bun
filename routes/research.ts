import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createResearch, deleteResearch, fetchAllResearch, fetchResearchDetail, updateResearch } from "../controllers/research"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllResearch)
router.post("/create", authMiddlewares, createResearch)
router.get("/:id", authMiddlewares, fetchResearchDetail)
router.put("/:id", authMiddlewares, updateResearch)
router.delete("/:id", authMiddlewares, deleteResearch)

export default router