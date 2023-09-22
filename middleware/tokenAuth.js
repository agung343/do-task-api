import jwt from "jsonwebtoken";
import CustomError from "./CustomError.js";

export const tokenAuth = async(req, res, next) => {
    try {
        const token = req.headers["Authorization"].replace("Bearer ","")
        if (!token) {
            return next(new CustomError("Token not here, Not Authenticated", 401))
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!decoded || !decoded.userId) {
            return next(new CustomError("Not Authenticated", 401))
        }

        req.userId = decoded.userId
        // req.params.userId = decoded.userId
        next()
    } catch (error) {
        return next(new CustomError("An Error Occured", 500))
    }
}
