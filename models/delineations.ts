import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const delineationSchema = new Schema(
    {
        observationId: { type: mongoose.Types.ObjectId, ref: "Observation", required: true },
        name: { type: String },
        description: { type: String },
        isValid: { type: Boolean },
        scenario: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Delineation = InferSchemaType<typeof delineationSchema>
export const Delineation = model("Delineation", delineationSchema)