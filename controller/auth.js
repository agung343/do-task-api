import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import User from "../model/user.js";
import CustomError from "../middleware/CustomError.js";

export const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const validateErrorMsg = errors.array().map(err => err.msg)
        return next(new CustomError("Error Validation", 422, validateErrorMsg))
    }

    try {
        const {firstName, lastName, email, password} = req.body

        const existingUser = await User.findOne({email: email}) 
        if (existingUser) {
            return next(new CustomError("Email already exist", 401))
        }
        
        const saltRound = Math.floor((Math.random() * 22 / 7 * 12 + 15) / 2)
        const hashPassword = await bcrypt.hash(password, saltRound)

        const newUser = new User({
            name: {
                firstName: firstName,
                lastName: lastName
            },
            email: email,
            password: hashPassword
        })

        const user = await newUser.save()

        res.status(201).json({
            message: "created new user",
            user: {
                _id: user._id,
                name: user.name
            }
        })
    } catch (error) {
        if(!(error instanceof CustomError)) {
            return next(new CustomError("An Error Occured", 500))
        }
        next(error)
    }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

export const login = async(req, res, next) => {
    try {
        const {email, password} = req.body
        
        if(!email || !password) {
            return next(new CustomError("Both field must be filled", 400))
        }

        const user = await User.findOne({email: email})
        if (!user) {
            return next(new CustomError("email or password incorrect", 401))
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return next(new CustomError("email or password incorrect", 401))
        }

        const token = jwt.sign({
            email: email,
            userId : user._id.toString()
        }, process.env.TOKEN_SECRET, {
            expiresIn: "4h"
        })
        
        res.status(200).json({
            token: token,
            userId: user._id.toString()
        })
    } catch (error) {
        if(!(error instanceof CustomError)) {
            return next(new CustomError("An Error Occured", 500))
        }
        next(error)
    }
}