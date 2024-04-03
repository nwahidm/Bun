import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const explorationSchema = new Schema(
    {
        delineationId: { type: mongoose.Types.ObjectId, ref: "Delineation", required: true },
        name: { type: String },
        plan: [
            {
                activity: String,
                start: String,
                end: String,
                done: Boolean
            }
        ],
        targetIdentity: {
            name: { type: String },
            nation: { type: String },
            IDCardNumber: { type: String }
        },
        result: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Exploration = InferSchemaType<typeof explorationSchema>
export const Exploration = model("Exploration", explorationSchema)