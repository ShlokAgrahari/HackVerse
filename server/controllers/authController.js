import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup=async(req,res)=>{
    try{
        const {name,email,phone,password}=req.body;

        const exisitingUser=await User.findOne({email});

        if(exisitingUser){
            console.log("User already exists");
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name,email,phone,password:hashedPassword
        });

        console.log("user created successfully");

        return res.json({messgae:"User created successfully"});
    }
    catch(error){
        return res.status(500).json({error:error.message});
    }
};

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

       const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid Credential"});
        }

        const token = jwt.sign(
   { id: user._id },
   process.env.JWT_SECRET,
   { expiresIn: "7d" }
  );

        res.json({
   token,
   user: {
    id: user._id,
    name: user.name,
    email: user.email
   }
  });
    }
    catch(error){
        return res.status(500).json({error:error.message});
    }
};