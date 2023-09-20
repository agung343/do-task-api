import mongoose, { Schema} from "mongoose";

const userSchema = new Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    email : {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Task"
        }
    ]
})

const User = mongoose.model("User", userSchema)
export default User;