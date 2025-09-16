const User = require('../models/user.model');
const bcrypt = require("bcrypt");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ 
      message: "Login successful", 
      username: user.email,
      hasAccess: user.hasAccess,
      subscriptionId: user.subscriptionId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};



exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists with this email." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      hasAccess: false,  
      subscriptionId: null,
      customerId: null
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        hasAccess: newUser.hasAccess
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};



exports.checkAccess = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ hasAccess: false, message: "User ID is required" });
    }

    const user = await User.findById(userId).select("hasAccess email name");
    if (!user) {
      return res.status(404).json({ hasAccess: false, message: "User not found" });
    }

    res.json({ hasAccess: user.hasAccess });
  } catch (err) {
    console.error("Error checking access:", err);
    res.status(500).json({ hasAccess: false, message: "Server error" });
  }
};



