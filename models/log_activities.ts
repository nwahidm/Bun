import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const logActivitySchema = new Schema(
    {
        activity: { type: String, required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        browser: { type: String },
        os: { type: String },
        ip: { type: String },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type LogActivity = InferSchemaType<typeof logActivitySchema>
export const LogActivity = model("Log_Activity", logActivitySchema)