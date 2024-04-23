import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const tailingSchema = new Schema(
    {
        explorationId: { type: mongoose.Types.ObjectId, ref: "Exploration", required: true },
        name: { type: String },
        result: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Tailing = InferSchemaType<typeof tailingSchema>
export const Tailing = model("Tailing", tailingSchema)