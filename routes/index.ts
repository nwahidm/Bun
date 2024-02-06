import express from "express"
import { loginUser, registerUser } from "../controllers/users"

const router = express.Router()

router.get("/ping", async (req, res) => {
    return res.status(200).json({
        message: "🏓 pong"
    })
})

router.post("/register", registerUser)
router.post("/login", loginUser)

export default router