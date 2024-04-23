import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createTailing, deleteTailing, fetchAllTailings, fetchTailingDetail, updateTailing } from "../controllers/tailings"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllTailings)
router.post("/create", authMiddlewares, createTailing)
router.get("/:id", authMiddlewares, fetchTailingDetail)
router.put("/:id", authMiddlewares, updateTailing)
router.delete("/:id", authMiddlewares, deleteTailing)

export default router