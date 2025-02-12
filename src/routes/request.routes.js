import {Router} from "express"
import { createRequest, fetchAllBuyerRequests } from "../controllers/request.controller.js"
import {verifyToken,verifySeller} from "../middleware/auth.middleware.js"

const router=Router()

router.route("/create-request").post(verifyToken,verifySeller,createRequest)
router.route("/fetch-buyer-requests").get(verifyToken,verifySeller,fetchAllBuyerRequests)


export default router