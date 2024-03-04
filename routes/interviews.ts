import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createInterview, deleteInterview, fetchAllInterviews, fetchInterviewDetail, updateInterview } from "../controllers/interviews"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllInterviews)
router.post("/create", authMiddlewares, createInterview)
router.get("/:id", authMiddlewares, fetchInterviewDetail)
router.put("/:id", authMiddlewares, updateInterview)
router.delete("/:id", authMiddlewares, deleteInterview)

export default router