import { Router } from "express";
import { body } from "express-validator";
import { tokenAuth } from "../middleware/tokenAuth.js";
import * as taskController from "../controller/task.js"

const router = Router()

router.get(
    "/:userId",
    tokenAuth,
    taskController.getUserTask
)

router.post(
    "/:userId/new",
    tokenAuth,
    [
        body("title").trim().notEmpty().withMessage("task can not be an empty named")
    ],
    taskController.newUserTask
)

router.patch(
    "/:taskId/patch",
    [
        body("title").trim().notEmpty().withMessage("task can not an empty named")
    ],  
    tokenAuth,
    taskController.editTask
)

router.delete(
    "/:taskId",
    tokenAuth,
    taskController.deleteTask
)

export default router;