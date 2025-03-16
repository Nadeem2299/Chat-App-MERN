import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res)=> {
  const {fullName, email, password} = req.body
  try {

    if(!fullName || !email || !password) {
      return res.status(400).json({message:"All the fields are mandatory"});
    }

    if(password.length<6) {
      return res.status(400).json({message:"Pasword must be more than 6 letters"});
    }

    const user = await User.findOne({email})
    if(user) {
      return res.status(400).json({message:"Email already exists"});
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    if(newUser) {
      // generate jwt token
      generateToken(newUser._id,res);
      await newUser.save();
      
      res.status(201).json({
        _id:newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic
      })

    } else {
      return res.status(400).json({message:"Invalid User Data"});
    }
  }
  catch(err) {
    console.log("error in sign up controller "+err.message);
    res.status(500).json({message:"Internal server Error"});
  }
}
export const login = async (req,res)=>{
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id,res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    })
  } catch(err) {
    console.log("Error in login contoller", err.message);
    res.status(500).json({message:"Internal server Error"});
  }

}
export const logout = (req,res)=>{
  try {
    res.cookie("jwt","",{maxAge: 0});
    return res.status(200).json({message:"Logged Out Successfully"});
  } catch(err) {
    console.log("Error in loggin out contoller", err.message);
    res.status(500).json({message:"Internal server Error"});
  }
}

export const updateProfile = async (req,res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic) {
      res.status(400).json({message: "Profile pic is required"})
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

      res.status(200).json(updateUser);
    }
  } catch(err) {
    console.log("error in update profile:" +err);
    res.status(500).json({message:"Internal server Error"});
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.log("Error in checkAuth controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};