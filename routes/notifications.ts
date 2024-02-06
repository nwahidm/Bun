import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createNotification, fetchAllNotification, fetchNotificationDetail, fetchUserNotification } from "../controllers/notifications"
const router = express.Router()

router.post("/", authMiddlewares, createNotification)
router.get("/", authMiddlewares, fetchAllNotification)
router.get("/profile", authMiddlewares, fetchUserNotification)
router.get("/:id", authMiddlewares, fetchNotificationDetail)

export default router