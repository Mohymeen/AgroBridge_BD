require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const Product = require("./models/Product");
const Order = require("./models/Order");

const {
  authMiddleware,
  authorizeRoles
} = require("./middleware/authMiddleware");

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


    // User Register Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.status(201).json({
      message: "User Registered Successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Registration Failed"
    });
  }
});

// User Login Route
app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Login failed"
    });

  }   
});
    // Create Product
app.post("/products",authMiddleware,authorizeRoles("Farmer", "Admin"), async (req, res) => {
  try {
    const product = new Product({
  ...req.body,
  farmer: req.user.userId
});
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
    const products = await Product.find().populate("farmer", "name");
    res.json(products);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
});

app.put(
  "/products/:id",
  authMiddleware,
  authorizeRoles("Farmer", "Admin"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      if (
        req.user.role !== "Admin" &&
        product.farmer.toString() !== req.user.userId
      ) {
        return res.status(403).json({
          message: "You are not authorized to modify this product"
        });
      }

      Object.assign(product, req.body);

      await product.save();

      res.json(product);

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to update product"
      });
    }
  }
);

// Delete Product
app.delete(
  "/products/:id",
  authMiddleware,
  authorizeRoles("Farmer", "Admin"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      if (
        req.user.role !== "Admin" &&
        product.farmer.toString() !== req.user.userId
      ) {
        return res.status(403).json({
          message: "You are not authorized to delete this product"
        });
      }

      await product.deleteOne();

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
  }
);

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


// Protected Test Route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    user: req.user
  });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});