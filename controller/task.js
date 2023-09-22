import { validationResult } from "express-validator";

import CustomError from "../middleware/CustomError.js";
import Task from "../model/task.js";
import User from "../model/user.js";

export const getUserTask = async(req, res, next) => {
    try {
        const {userId} = req.params

        const user = await User.findById(userId)
        
        const tasks = await Task.find({user: userId})
        
        res.status(200).json({
            tasks: tasks,
            user: user.name.firstName
        })
    } catch (error) {
        if(!(error instanceof CustomError)) {
            return next(new CustomError("An Error Occured", 500))
        }
        next(err)
    }
}

export const newUserTask = async(req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const validateErrorMsg = errors.array().map(err => err.msg)
        return next(new CustomError("Invalid input", 422, validateErrorMsg))
    }

    try {
        const {userId} = req.params;
        const tokenUserId = req.userId

        const {title} = req.body

        const newTask = new Task({
            title: title,
            status: "PENDING",
            user: userId
        })

        const task = await newTask.save()

        const user = await User.findById(userId)
        if (user) {
            user.tasks.push(task._id)
            await user.save()
        }

        res.status(201).json({
            message: "new task created",
            task: task,
            user: tokenUserId
        })
    } catch (error) {
        if (!(error instanceof CustomError)) {
            return next(new CustomError("An Error Occured in Server", 500))
        }
        next(error)
    }
}


export const editTask = async(req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const validateErrorMsg = errors.array().map(err => err.msg)
        return next(new CustomError("Invalid input", 422, validateErrorMsg))
    }

    try {
        const taskId = req.params
        const tokeUserId = req.userId

        let {title, status} = req.body
        const task = await Task.findById(taskId)
        if (!task) {
            return next(new CustomError("Could not find task", 404))
        }

        if (title) task.title = title

        if (status === "DONE") {
            task.status = "DONE"
        } else {
            task.status = "PENDING"
        }

        const updateTask = await task.save()
        
        res.status(201).json({
            task: updateTask
        })
    } catch (error) {
        if (!(error instanceof CustomError)) {
            return next(new CustomError("An Error Occured in Server", 500))
        }
        next(error)
    }
}


export const deleteTask = async (req, res, next) => {
    try {
        const {taskId} = req.params
        const tokenUserId = req.userId

        const deleted = await Task.findByIdAndDelete(taskId)
        if (!deleted) {
            return next(new CustomError("An Error Occured, could not delete task", 500))
        }
        
        const user = await User.updateOne(
            {_id: userObjId},
            { $pull : {
                tasks: taskId
            }}
        )
        if(!user) {
            return next(new CustomError("Someting went wrong", 500))
        }

        res.status(200).json({
            message: "task has been deleted"
        })
    } catch (error) {
        if (!(error instanceof CustomError)) {
            return next(new CustomError("An Error Occured in Server", 500))
        }
        next(error)
    }
}

