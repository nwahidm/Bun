import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const tappingSchema = new Schema(
    {
        intrusionId: { type: mongoose.Types.ObjectId, ref: "Intrusion", required: true },
        name: { type: String },
        information: { type: String },
        signalData: { type: String },
        result: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Tapping = InferSchemaType<typeof tappingSchema>
export const Tapping = model("Tapping", tappingSchema)