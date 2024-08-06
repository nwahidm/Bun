import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createCase, deleteCase, fetchAllCases, fetchCaseDetail, updateCase } from "../controllers/cases"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllCases)
router.post("/create", authMiddlewares, createCase)
router.get("/:id", authMiddlewares, fetchCaseDetail)
router.put("/:id", authMiddlewares, updateCase)
router.delete("/:id", authMiddlewares, deleteCase)

export default router