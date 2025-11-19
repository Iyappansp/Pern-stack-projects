import express from "express";
import { getAllProducts, createProduct } from "../controllers/productController.js";
const router = express.Router();

// router.get("/",(req,res)=>{
//     res.send("Hello World");
// });
// router.post("/",(req,res)=>{
//     res.send("Hello World");
// });

router.get("/",getAllProducts);
router.post("/",createProduct);

export default router;