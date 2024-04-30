import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createIntrusion, deleteIntrusion, fetchAllIntrusions, fetchIntrusionDetail, updateIntrusion } from "../controllers/intrusions"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllIntrusions)
router.post("/create", authMiddlewares, createIntrusion)
router.get("/:id", authMiddlewares, fetchIntrusionDetail)
router.put("/:id", authMiddlewares, updateIntrusion)
router.delete("/:id", authMiddlewares, deleteIntrusion)

export default router