import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const observationSchema = new Schema(
    {
        warrantId: { type: mongoose.Types.ObjectId, ref: "Warrant", required: true },
        name: { type: String },
        result: { type: String },
        threats: { type: String },
        interference: { type: String },
        barrier: { type: String },
        challenges: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Observation = InferSchemaType<typeof observationSchema>
export const Observation = model("Observation", observationSchema)