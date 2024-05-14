import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { elicitationCounter, interrogationCounter, interviewCounter, researchCounter, observationCounter, delineationCounter, explorationCounter, tailingCounter, infiltrationCounter, intrusionCounter, tappingCounter } from "../controllers/dashboard"

const router = express.Router()

router.post("/research", authMiddlewares, researchCounter)
router.post("/interview", authMiddlewares, interviewCounter)
router.post("/interrogation", authMiddlewares, interrogationCounter)
router.post("/elicitation", authMiddlewares, elicitationCounter)
router.post("/observation", authMiddlewares, observationCounter)
router.post("/delineation", authMiddlewares, delineationCounter)
router.post("/exploration", authMiddlewares, explorationCounter)
router.post("/tailing", authMiddlewares, tailingCounter)
router.post("/infiltration", authMiddlewares, infiltrationCounter)
router.post("/intrusion", authMiddlewares, intrusionCounter)
router.post("/tapping", authMiddlewares, tappingCounter)

export default router