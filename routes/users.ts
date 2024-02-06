import express from "express"
import { activateUser, deleteUser, fetchAllUsers, fetchUserDetail, updateProfile, updateUser, userProfile } from "../controllers/users"
import { authMiddlewares } from "../middlewares/middlewares"

const router = express.Router()

router.post("/", authMiddlewares, fetchAllUsers)
router.get("/profile", authMiddlewares, userProfile)
router.put("/profile", authMiddlewares, updateProfile)
router.patch("/activate/:id", activateUser)
router.get("/:id", authMiddlewares, fetchUserDetail)
router.put("/:id", authMiddlewares, updateUser)
router.delete("/:id", authMiddlewares, deleteUser)

export default router