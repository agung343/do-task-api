import { Router } from "express";
import { body } from "express-validator";
import { tokenAuth } from "../middleware/tokenAuth.js";
import * as taskController from "../controller/task.js"

const router = Router()

router.get(
    "/:userId",
    taskController.getUserTask
)

router.post(
    "/:userId/new",
    [
        body("title").trim().not().isEmpty().withMessage("task can not be an empty named")
    ],
    tokenAuth,
    taskController.newUserTask
)

router.patch(
    "/:taskId/patch",
    [
        body("title").trim().not().isEmpty().withMessage("task can not an empty named")
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
