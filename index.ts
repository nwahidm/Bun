import express from "express"
import indexRouter from "./routes/index"
import userRouter from "./routes/users"
import logRouter from "./routes/log_activities"
import kewenanganRouter from "./routes/kewenangan"
import notificationRouter from "./routes/notifications"
import researchRouter from "./routes/researches"
import warrantRouter from "./routes/warrants"
import interviewRouter from "./routes/interviews"
import interrogationRouter from "./routes/interrogations"
import elicitationRouter from "./routes/elicitations"
import dashboardRouter from "./routes/dashboard"
import observationRouter from "./routes/observations"
import delineationRouter from "./routes/delineations"
import explorationRouter from "./routes/explorations"
import tailingRouter from "./routes/tailings"
import infiltrationRouter from "./routes/infiltrations"
import intrutionRouter from "./routes/intrutions"
import connectDB from "./config/db"
import { errorHandler } from "./middlewares/errorHandler"
import multerMiddleware from "./config/multer"

const app = express()
const port = Bun.env.PORT || 5025

connectDB()

app.use(multerMiddleware.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'foto', maxCount: 1 },
    { name: 'document', maxCount: 1 }
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
app.use("/warrant", warrantRouter)
app.use("/research", researchRouter)
app.use("/interview", interviewRouter)
app.use("/interrogation", interrogationRouter)
app.use("/elicitation", elicitationRouter)
app.use("/dashboard", dashboardRouter)
app.use("/observation", observationRouter)
app.use("/delineation", delineationRouter)
app.use("/exploration", explorationRouter)
app.use("/tailing", tailingRouter)
app.use("/infiltration", infiltrationRouter)
app.use("/intrution", intrutionRouter)
app.use("/uploads/avatar", express.static(import.meta.dir + `/uploads/avatar`))
app.use("/uploads/notification", express.static(import.meta.dir + `/uploads/notification`))
app.use("/uploads/document", express.static(import.meta.dir + `/uploads/document`))


app.use(errorHandler)

app.listen(port, () => {
    console.log(`Service running on port ${port} 🚀🚀🚀`)
})