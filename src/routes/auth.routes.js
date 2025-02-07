import { Router } from "express";
import {create_user, loginUser} from "../controllers/auth.controllers.js"

const router=Router()

router.route("/register-user").post(create_user)

router.route("/login-user").post(loginUser)

export default router