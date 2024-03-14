import express from "express"
import { authMiddlewares } from "../middlewares/middlewares"
import { createElicitation, deleteElicitation, fetchAllElicitations, fetchElicitationDetail, updateElicitation } from "../controllers/elicitations"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllElicitations)
router.post("/create", authMiddlewares, createElicitation)
router.get("/:id", authMiddlewares, fetchElicitationDetail)
router.put("/:id", authMiddlewares, updateElicitation)
router.delete("/:id", authMiddlewares, deleteElicitation)

export default router