import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import authRoute from "./route/auth.js"
import taskRoute from "./route/task.js"

dotenv.config()
const app = express()

app.use(bodyParser.json())

app.use(
    cors({
        credentials: true,
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)

app.use("/auth", authRoute)
app.use("/task", taskRoute)

app.use(errorHandler)

mongoose.connection.on("disconnected", () => console.log("database disconnected"))
mongoose.connection.on("connected", () => console.log("database connected"))

mongoose.connect(process.env.MONGODB_URI).then(() => app.listen(8080, () => console.log(`Listening at 8080`))).catch(err => console.log(err))
