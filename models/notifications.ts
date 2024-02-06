import { Schema, type InferSchemaType, model } from "mongoose"

const notificationSchema = new Schema(
    {
        judul: { type: String, required: true },
        isi: { type: String, required: true },
        foto: { type: String, required: true },
        isRead: { type: Boolean }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Notification = InferSchemaType<typeof notificationSchema>
export const Notification = model("Notification", notificationSchema)