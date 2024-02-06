import mongoose from "mongoose"

export default async function connectDB() {
    try {
        await mongoose.connect(Bun.env.URI as string)
    } catch (error) {
        const castedError = error as Error
        console.error(castedError.message)
        process.exit(1)
    }
}

mongoose.connection.once("open", (_) => {
    console.log("Database Connected")
})

mongoose.connection.on("error", (err) => {
    console.log(`Database Connection error: ${err}`)
})
