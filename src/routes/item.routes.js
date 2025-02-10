import { Router } from "express";
import { addItems, deleteItem, fetchItems, fetchSpecificItem } from "../controllers/item.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";


const router =Router()


//secured route as seller need to be logged-in 
router.route("/add-item").post(verifyToken,addItems)
router.route("/fetch-items").post(verifyToken,fetchItems)
router.route("/fetch-specific-item").post(verifyToken,fetchSpecificItem)
router.route("/delete-item").post(verifyToken,deleteItem)

export default router