import mongoose, { Schema} from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "DONE"],
        default: "PENDING"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

const Task = mongoose.model("Task", taskSchema)
export default Task;