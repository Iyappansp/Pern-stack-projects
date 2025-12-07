import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `;
    console.log("products", products);

    res.status(200).json(products);
  } catch (error) {
    console.log("get products error", error);
    res.status(500).json({ success: false, message: "server error mamery" });
  }
};
export const createProduct = async (req, res) => {
  const { name, image, price, description } = req.body;

  if (!name || !image || !price || !description) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const newProduct = await sql`
        INSERT INTO products (name, image, price, description)
        VALUES (${name}, ${image}, ${price}, ${description})
        RETURNING *
      `;

    res.status(201).json({ success: true, product: newProduct[0] });
  } catch (error) {
    console.log("creation error", error);
    res.status(500).json({ success: false, message: "server error mamery" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`
        SELECT * FROM products WHERE id = ${id}
       `;
    //    console.log("product",product);
    res.status(200).json({ success: true, product: product[0] });
  } catch (error) {
    console.log("product error", error);
    res.status(500).json({ success: false, message: "server error mamery" });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price, description } = req.body;

  try {
    // First, get the existing product to preserve values for fields not provided
    const existingProduct = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    if (existingProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Use provided values or keep existing ones (for partial updates)
    const updatedName =
      name !== undefined && name !== null && name !== ""
        ? name
        : existingProduct[0].name;
    const updatedImage =
      image !== undefined && image !== null && image !== ""
        ? image
        : existingProduct[0].image;
    const updatedPrice =
      price !== undefined && price !== null ? price : existingProduct[0].price;
    const updatedDescription =
      description !== undefined ? description : existingProduct[0].description;

    // Validate required fields are not empty
    if (!updatedName || !updatedImage) {
      return res.status(400).json({
        success: false,
        message: "Name and image are required fields and cannot be empty",
      });
    }

    const updatedProduct = await sql`
        UPDATE products 
        SET name = ${updatedName}, 
            image = ${updatedImage}, 
            price = ${updatedPrice}, 
            description = ${updatedDescription}
        WHERE id = ${id}
        RETURNING *
    `;

    res.status(200).json({ success: true, product: updatedProduct[0] });
  } catch (error) {
    console.log("updation error", error);
    res.status(500).json({ success: false, message: "server error mamery" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  // if (!id) {
  //     return res.status(400).json({ success:false, message: "Product ID is required" });
  // }
  try {
    const deletedProduct = await sql`
        DELETE FROM products WHERE id = ${id}
        RETURNING *
        `;
    res.status(200).json({ success: true, product: deletedProduct[0] });
  } catch (error) {
    console.log("deletion error", error);
    res.status(500).json({ success: false, message: "server error mamery" });
  }
};
