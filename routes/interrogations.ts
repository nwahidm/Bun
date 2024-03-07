import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createInterrogation, deleteInterrogation, fetchAllInterrogations, fetchInterrogationDetail, updateInterrogation } from "../controllers/interrogations"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllInterrogations)
router.post("/create", authMiddlewares, createInterrogation)
router.get("/:id", authMiddlewares, fetchInterrogationDetail)
router.put("/:id", authMiddlewares, updateInterrogation)
router.delete("/:id", authMiddlewares, deleteInterrogation)

export default router