import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createObservation, deleteObservation, fetchAllObservations, fetchObservationDetail, updateObservation } from "../controllers/observations"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllObservations)
router.post("/create", authMiddlewares, createObservation)
router.get("/:id", authMiddlewares, fetchObservationDetail)
router.put("/:id", authMiddlewares, updateObservation)
router.delete("/:id", authMiddlewares, deleteObservation)

export default router