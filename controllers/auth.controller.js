const User = require('../models/user.model');
const bcrypt = require("bcrypt");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", username: user.email });
  } catch (err) {
    res.status(500).json({ message: " internal Server error" });
  }
};



exports.register = async(req,res) =>{
        try{
        const { name , email,mobile ,password } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({ message : "user alrady exist in this email."});
        const salt = await bcrypt.genSalt(10);
        const hasPassword = await bcrypt.hash(password,salt);
        const newwUser = await User({
                name,
                email,
                mobile,
                password : hasPassword
        })       
        await newwUser.save();
        res.status(201).json({
                message:"user register succefully",
                user :{
                    id : newwUser._id,
                    name: newwUser.name,
                    email:newwUser.email,
                    mobile : newwUser.mobile      
                }
        })
}
catch(err){
      res.status(500).json({ message: " internal Server error" });  
}
}




