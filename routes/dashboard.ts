import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { elicitationCounter, interrogationCounter, interviewCounter, researchCounter } from "../controllers/dashboard"

const router = express.Router()

router.post("/research", authMiddlewares, researchCounter)
router.post("/interview", authMiddlewares, interviewCounter)
router.post("/interrogation", authMiddlewares, interrogationCounter)
router.post("/elicitation", authMiddlewares, elicitationCounter)


export default router