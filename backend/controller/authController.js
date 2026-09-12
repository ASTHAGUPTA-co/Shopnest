const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendemail.js");


const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: '7d'});
}


const registerUser = async (req,res)=>{
    const {name,email,password } = req.body;
    
    try{
        const extinguisher = await User.findOne({email});
        if(extinguisher) {
            return res.status(400).json({message:"user already exists"});
        }
        // todos : hash pass, imple jwt token , otp sending , welcome mail

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user =await  User.create({name,email, password:hashedPassword});
        if(user){
            const otp = Math.floor(100000 + Math.random()*900000).toString();
            const message = `Welcome to ShopNest, ${name}! Thank you for registring with us.
            Your OTP for ShopNest registration is ${otp}`;
            await sendEmail(email,'Welcome to ShopNest - Your OTP for ShopNest registration',message);
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token:generateToken(user._id)
            });
        }else{
            res.status(400).json({message:"Invalid user data"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
}


const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user && (await bcrypt.compare(password,user.password))){
            res.json({
                _id:user._id,
                name: user.name,
                email:user.email,
                role:user.role,
                token: generateToken(user._id)
            })
        }else{
            res.status(400).json({message:"Invalid email or password"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
}


const getUser = async (req,res)=>{
    try{
        const users = await User.find({}).select("-password");
        res.json(users);
    }catch(error){
        res.status(500).json({message:"Server Error"})
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUser
} 