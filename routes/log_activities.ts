import express from "express"
import { fetchAllLogs, fetchAllLogsByProfile, fetchLogDetail } from "../controllers/log_activities"
import { authMiddlewares } from "../middlewares/middlewares"
const router = express.Router()

router.post("/", authMiddlewares ,fetchAllLogs)
router.get("/user", authMiddlewares ,fetchAllLogsByProfile)
router.get("/:id", authMiddlewares, fetchLogDetail)


export default router