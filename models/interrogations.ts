import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const interrogationSchema = new Schema(
    {
        warrantId: { type: mongoose.Types.ObjectId, ref: "Warrant", required: true },
        record: { type: String },
        targetIdentification: {
            name: { type: String },
            posture: { type: String },
            height: { type: String },
            skinColor: { type: String }
        },
        result: { type: String }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Interrogation = InferSchemaType<typeof interrogationSchema>
export const Interrogation = model("Interrogation", interrogationSchema)