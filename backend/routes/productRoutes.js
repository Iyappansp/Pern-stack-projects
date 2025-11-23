import express from "express";
import { getProducts, createProduct, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
const router = express.Router();

// router.get("/",(req,res)=>{
//     res.send("Hello World");
// });
// router.post("/",(req,res)=>{
//     res.send("Hello World");
// });

router.get("/",getProducts);
router.get("/:id",getProduct);
router.put("/:id",updateProduct);
router.post("/",createProduct);
router.delete("/:id",deleteProduct);

// export const createProduct = async (req,res)=>{


export default router;