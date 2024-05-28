import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const interrogationSchema = new Schema(
    {
        interviewId: { type: mongoose.Types.ObjectId, ref: "Interview", required: true },
        name: { type: String },
        record: { type: String },
        targetIdentification: {
            name: { type: String },
            gender: { type: String },
            posture: { type: String },
            height: { type: String },
            skinColor: { type: String }
        },
        result: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Interrogation = InferSchemaType<typeof interrogationSchema>
export const Interrogation = model("Interrogation", interrogationSchema)