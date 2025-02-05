import { Router } from "express";
import {create_user} from "../controllers/auth.controllers.js"

const router=Router()

router.route("/register-user").post(create_user)

export default router