require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to AgroBridge Bangladesh!");
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });

    // Create Product
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);

    await product.save();

    res.status(201).json(product);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create product"
    });
  }
});

// Get all Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update product"
    });
  }
});

// Delete Product
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully",
      product
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete product"
    });
  }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});