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
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});