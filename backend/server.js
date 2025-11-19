// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
// import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/products",productRoutes);
    // console.log(req.Headers());
    // res.send("Hello World");
// res.status(200).json({
//     success: true,
//     data: [
//         {
//             id: 1,
//             name: "Product 1",
//         },
//         {
//             id: 2,
//             name: "Product 2",
//         },
//         {
//             id: 3,
//             name: "Product 3",
//         }
//     ]
// })

});

app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});