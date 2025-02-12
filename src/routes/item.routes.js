import { Router } from "express";
import { addItems, deleteItem, fetchItems, fetchSpecificItem, markItemAsSold, updateItem } from "../controllers/item.controller.js";
import { verifyToken,verifySeller } from "../middleware/auth.middleware.js";


const router =Router()


//secured route as seller need to be logged-in 
router.route("/add-item").post(verifyToken,verifySeller,addItems)
router.route("/fetch-items").get(verifyToken,fetchItems)
router.route("/fetch-item/:id").get(verifyToken,fetchSpecificItem)
router.route("/delete-item/:id").delete(verifyToken,verifySeller,deleteItem)
router.route("/update-item/:id").put(verifyToken,verifySeller,updateItem)
router.route("/mark-item-sold/:id").patch(verifyToken,verifySeller,markItemAsSold)



export default router