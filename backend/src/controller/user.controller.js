import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens.utils.js';
import cloudinary from '../utils/cloudinary.js';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if(password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user=await User.findOne({email});

    if(user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    if(newUser){
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        await newUser.save();

        const options = {
            httpOnly: true,
            secure: false
        }

        res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ 
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
              },
            accessToken,
            refreshToken
        });
    }
}

export const login = async (req, res) => {
    try{
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user= await User.findOne({username});

    if(!user) {
        return res.status(400).json({ message: 'user does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    const options = {
        httpOnly: true,
        secure: false
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        },
    });

    }catch(error){
        console.log("Login error:", error);
        res.status(500).json({ message: error.message });
    }

}

export const logout = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: false
        }
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: 'Logout successful' });
    } catch (error) {
        console.log("Logout error:", error);
        res.status(500).json({ message: error.message });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const {username}=req.query;
        console.log(req.user);

        if(!username) {
            return res.status(400).json({ message: 'Username query parameter is required' });
        }

        const loggedInUserId = req.user.id;

        const users=await User.find({
            username:{$regex: username, $options: "i" },
            _id: { $ne: loggedInUserId }
          })
            .sort({ username: 1 })   // simple alphabetical
            .limit(10)
            .select("-password");
      
        res.status(200).json(users);

    }catch (error) {
        console.log("Search users error:", error);
        res.status(500).json({ message: error.message });
    }
}


export const updateProfile = async (req, res) => {
    try {
      const { profilePicture } = req.body;
      const userId = req.user.id;
  
      if (!profilePicture) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: uploadResponse.secure_url },
        { new: true }
      ).select("-password -refreshToken");

      console.log("User ID:", userId);
console.log("Updated user:", updatedUser);
  
      return res.status(200).json(updatedUser);
  
    } catch (error) {
      console.log("error in update profile:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
      
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };