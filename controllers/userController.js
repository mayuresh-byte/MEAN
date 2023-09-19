const asyncHandler = require("express-async-handler");
const User = require("../models/userModel"); // For hashing password
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

// @desc register user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const userAvailable = await User.findOne({email});
    if(userAvailable) {
        res.status(400);
        throw new Error("User already exist !");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username, 
        email,
        password:hashedPassword,
    });

    if(user) {
        res.status(201).json({_id: user._id, email: user.email});
    } else {
        res.status(400);
        throw new Error("Invalid data");
    }

    res.json({message: "Register the user"});
});

// @desc register user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All Fileds are mandatory");
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
        res.status(200).json({accessToken});
    } else {
        res.status(400);
        throw new Error("Email or Password is not valid !");
    }
    res.json({message: "login user"});
});

// @desc register user
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = {registerUser, loginUser, currentUser};