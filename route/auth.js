import { Router } from "express"
import { body } from "express-validator"
import * as authController from "../controller/auth.js"

const router = Router()

router.post(
    "/signup",
    [
        body("firstName").trim().notEmpty().withMessage("name field can not be emptied"),
        body("lastName").trim().notEmpty().withMessage("name field can not be emptied"),
        body("email").isEmail().withMessage("please enter valid email address").normalizeEmail(),
        body("password").isLength({min: 6}).withMessage("password too short, at least 6 characters long")
    ],
    authController.signup
)

router.post(
    "/login",
    authController.login
)

export default router;