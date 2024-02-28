import express from "express"
import indexRouter from "./routes/index"
import userRouter from "./routes/users"
import logRouter from "./routes/log_activities"
import kewenanganRouter from "./routes/kewenangan"
import notificationRouter from "./routes/notifications"
import researchRouter from "./routes/research"
import connectDB from "./config/db"
import { errorHandler } from "./middlewares/errorHandler"
import multerMiddleware from "./config/multer"

const app = express()
const port = Bun.env.PORT || 5025

connectDB()

app.use(multerMiddleware.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'foto', maxCount: 1 }
]))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        );
        return res.status(200).json({});
    }
    next();
});

app.use("/", indexRouter)
app.use("/user", userRouter)
app.use("/log", logRouter)
app.use("/kewenangan", kewenanganRouter)
app.use("/notification", notificationRouter)
app.use("/research", researchRouter)
app.use("/uploads/avatar", express.static(import.meta.dir + `/uploads/avatar`));
app.use("/uploads/notification", express.static(import.meta.dir + `/uploads/notification`));


app.use(errorHandler)

app.listen(port, () => {
    console.log(`Service running on port ${port} 🚀🚀🚀`)
})