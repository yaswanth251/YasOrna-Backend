const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const UserModel = require("./models/User");
const AdminModel = require("./models/Adminn")

const app = express();
app.use(express.json());
app.use(cors());



mongoose.connect("mongodb+srv://yasorna:yaswanth@cluster0.h4xrzje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(result => console.log("Db connected...")).catch(err => console.log(err))

// ✅ User Registration (POST /userregister)
app.post('/userregister', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

        // Create new user with hashed password
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        // Send response (excluding password for security)
        res.status(201).json({ 
            message: "Registration successful!", 
            name: newUser.name,  
            email: newUser.email  
        });

    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});




// ✅ User Login (POST /login)
app.post('/userlogin', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login request:", req.body);
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Success
      res.json({
        message: "Login successful",
        name: user.name,
        email: user.email
      });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  });



app.post('/adminregister', async (req, res) => {
    try {
        const { name,mobile, email, password } = req.body;


        // Check if user already exists
        const existingUser = await AdminModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Create new user
        const user = await AdminModel.create({ name,mobile, email, password });
        res.status(201).json(user);
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});




// ✅ User Login (POST /login)
app.post('/adminlogin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await AdminModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({ message: "Login successful", name: user.name,
            email: user.email  });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
