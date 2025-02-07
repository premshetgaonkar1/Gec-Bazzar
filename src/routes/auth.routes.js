import { Router } from "express";
import {create_user, loginUser, logoutUser} from "../controllers/auth.controllers.js"
import { verifyToken } from "../middleware/auth.middleware.js";

const router=Router()

router.route("/register-user").post(create_user)

router.route("/login-user").post(loginUser)
router.route("/logout-user").post(verifyToken,logoutUser)

export default router