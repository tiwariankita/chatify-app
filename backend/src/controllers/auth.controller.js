import User from "../models/User.js"
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import {ENV} from "../lib/env.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }
        // check if emailis valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({email}) // return first occurence match if email
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser) {
            generateToken(newUser._id, res);
            const savedUser = await newUser.save(); // save it to mongodb

            res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            })
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch(error) {
                console.log("Error sending welcome email", error);
            }
        } else {
            res.status(400).json({message: "Invalid user data"});
        }

    } catch(error) {
        console.log("error in signup controller", error);
        res.status(500).json({message: "Internal server error"});
    }
   
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }
    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message : "Invalid credentials"});
    
        }
        let isValidatePassword = await bcrypt.compare(password, user.password);
        if(!isValidatePassword)  {
            return res.status(400).json({message : "Invalid credentials"});
        }
        console.log(user);
        console.log(password);
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });   
    } catch(error) {
        console.log("error in login controller", error);
        res.status(500).json({message: "Internal server error"});
    }
    
}

export const logout = async(_, res) => {
    res.cookie("jwt", "", {
        maxAge: 0
    });
    res.status(200).json({message: "Logged out successfully"});
}



