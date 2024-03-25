import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createDelineation, deleteDelineation, fetchAllDelineations, fetchDelineationDetail, updateDelineation } from "../controllers/delineations"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllDelineations)
router.post("/create", authMiddlewares, createDelineation)
router.get("/:id", authMiddlewares, fetchDelineationDetail)
router.put("/:id", authMiddlewares, updateDelineation)
router.delete("/:id", authMiddlewares, deleteDelineation)

export default router