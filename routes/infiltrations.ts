import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createInfiltration, deleteInfiltration, fetchAllInfiltrations, fetchInfiltrationDetail, updateInfiltration } from "../controllers/infiltrations"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllInfiltrations)
router.post("/create", authMiddlewares, createInfiltration)
router.get("/:id", authMiddlewares, fetchInfiltrationDetail)
router.put("/:id", authMiddlewares, updateInfiltration)
router.delete("/:id", authMiddlewares, deleteInfiltration)

export default router