const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const UserModel = require("./models/User");
const AdminModel = require("./models/Adminn");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://yasorna:yaswanth@cluster0.h4xrzje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(() => console.log("✅ Database connected"))
.catch(err => console.log("❌ DB connection error:", err));

// Health Check Route
app.get("/", (req, res) => {
    res.send("🚀 Backend server running!");
});

// ✅ User Registration
app.post('/userregister', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ 
            message: "User registered successfully", 
            name: newUser.name,
            email: newUser.email 
        });

    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

// ✅ User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({ 
            message: "Login successful", 
            name: user.name,
            email: user.email 
        });

    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

// ✅ Admin Registration
app.post('/adminregister', async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;

        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await AdminModel.create({ name, mobile, email, password: hashedPassword });

        res.status(201).json({ 
            message: "Admin registered successfully", 
            name: newAdmin.name,
            email: newAdmin.email 
        });

    } catch (error) {
        console.error("Error in admin registration:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

// ✅ Admin Login
app.post('/adminlogin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({ 
            message: "Admin login successful", 
            name: admin.name,
            email: admin.email 
        });

    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

// Start Server
app.listen(3001, () => {
    console.log("🚀 Server is running on port 3001");
});
