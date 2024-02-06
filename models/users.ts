import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const userSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        nama_lengkap: { type: String, required: true },
        nip: { type: String, required: true },
        jenis_kelamin: { type: Number, required: true, enum: [0, 1] },
        kewenangan_id: { type: mongoose.Types.ObjectId, ref: "Kewenangan", required: true },
        avatar: { type: String },
        enabled: { type: Boolean, required: true },
        notifications: [
            {
                notification_id: mongoose.Schema.Types.ObjectId,
                isRead: Boolean
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type User = InferSchemaType<typeof userSchema>
export const User = model("User", userSchema)