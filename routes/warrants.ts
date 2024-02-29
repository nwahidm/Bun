import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createWarrant, deleteWarrant, fetchAllWarrants, fetchWarrantDetail, updateWarrant } from "../controllers/warrants"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllWarrants)
router.post("/create", authMiddlewares, createWarrant)
router.get("/:id", authMiddlewares, fetchWarrantDetail)
router.put("/:id", authMiddlewares, updateWarrant)
router.delete("/:id", authMiddlewares, deleteWarrant)

export default router