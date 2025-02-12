import {Router} from "express"
import { createRequest, deleteRequest, fetchAllBuyerRequests } from "../controllers/request.controller.js"
import {verifyToken,verifySeller} from "../middleware/auth.middleware.js"

const router=Router()

router.route("/create-request").post(verifyToken,createRequest)
router.route("/fetch-buyer-requests").get(verifyToken,verifySeller,fetchAllBuyerRequests)
router.route("/delete-request").delete(verifyToken,verifySeller,deleteRequest)


export default router