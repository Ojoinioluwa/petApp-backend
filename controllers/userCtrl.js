const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userController = {

    // Register a new user
    register: asyncHandler(async (req, res) => {
        const { name, email, password, phoneNumber, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400)
            throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
            },
        });
    }),
    // login
    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;


        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400)
            throw new Error("Invalid credentials");
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400)
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });


        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
            },
        });
    }),
    // get profile
    getProfile: asyncHandler(async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.user)) {
            res.status(400);
            throw new Error('Invalid user ID format');
        }
        const user = await User.findById(req.user).select("-password").lean()
        if (!user) {
            res.status(404)
            throw new Error("User does not exist");
        }
        res.status(200).json({
            message: "User profile fetched succesfully",
            user
        })
    }),
    // update profile
    updateProfile: asyncHandler(async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.user)) {
            res.status(400);
            throw new Error('Invalid user ID format');
        }
        const user = await User.findByIdAndUpdate(req.user, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
            }
        })

        if (!user) {
            res.status(404)
            throw new error("User does not exist")
        }
    })
}

module.exports = userController;