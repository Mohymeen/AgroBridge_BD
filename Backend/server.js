require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");

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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});