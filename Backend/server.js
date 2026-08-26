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

// Create Order
app.post("/orders", async (req, res) => {
  try {
    const order = new Order(req.body);

    await order.save();

    res.status(201).json(order);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to place order"
    });
  }
});

// Get all Orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();

    res.json(orders);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
});

// Update Order
app.put("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json(order);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update order"
    });
  }
});

// Delete Order
app.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      message: "Order deleted successfully",
      order
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete order"
    });
  }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});