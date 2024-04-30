import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createIntrution, deleteIntrution, fetchAllIntrutions, fetchIntrutionDetail, updateIntrution } from "../controllers/intrutions"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllIntrutions)
router.post("/create", authMiddlewares, createIntrution)
router.get("/:id", authMiddlewares, fetchIntrutionDetail)
router.put("/:id", authMiddlewares, updateIntrution)
router.delete("/:id", authMiddlewares, deleteIntrution)

export default router