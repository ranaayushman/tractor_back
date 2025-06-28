import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import fs from 'fs';
import { Product } from "../models/products.model.js";
const JWT_SECRET = process.env.JWT_SECRET;
// Temporary OTP for development
const TEMP_OTP = "123456";
export const createUser = async (req, res) => {
    try {
        let profilePictureUrl;
        let userIdForFilename = req.body.userId || 'newuser';
        if (req.file) {
            const extension = req.file.mimetype.split("/")[1];
            const username = (req.body.username || '').replace(/\s+/g, '_');
            const customFilename = `tractorProfilePicture_${username}_${userIdForFilename}.${extension}`;
            const destPath = `uploads/profilePicture/${customFilename}`;
            fs.renameSync(req.file.path, destPath);
            profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/profilePicture/${customFilename}`;
        }
        const user = await User.create({
            phoneNumber: req.body.phoneNumber,
            username: req.body.username,
            email: req.body.email,
            profilePicture: profilePictureUrl,
        });
        res.status(201).json(user);
    }
    catch (err) {
        console.error("User creation failed:", err);
        res.status(500).json({ message: "Error creating user", error: err });
    }
};
export const getUsers = async (_req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err });
    }
};
export const signup = async (req, res) => {
    console.log('=== SIGNUP CONTROLLER START ===');
    console.log('Request body:', req.body);
    try {
        const { phoneNumber, otp, name, state, district } = req.body;
        if (!phoneNumber || !otp) {
            console.log('Missing phoneNumber or OTP');
            return res
                .status(400)
                .json({ success: false, message: "Phone number and OTP are required" });
        }
        if (otp !== TEMP_OTP) {
            console.log('Invalid OTP provided:', otp);
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        // Check if user already exists
        console.log('Checking if user exists with phoneNumber:', phoneNumber);
        const existingUser = await User.findOne({ where: { phoneNumber } });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        // Create new user with additional data
        console.log('Creating new user with data:', { phoneNumber, name, state, district });
        const user = await User.create({
            phoneNumber,
            name,
            state,
            district
        });
        // Generate JWT
        console.log('Generating JWT token');
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "24h",
        });
        console.log('Signup successful, sending response');
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                state: user.state,
                district: user.district
            },
        });
    }
    catch (err) {
        console.error("Signup failed:", err);
        return res.status(500).json({ success: false, message: "Error during signup", error: err });
    }
};
export const login = async (req, res) => {
    console.log('=== LOGIN CONTROLLER START ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    try {
        const { phoneNumber, otp } = req.body;
        // Validate input
        if (!phoneNumber || !otp) {
            console.log('Missing phoneNumber or OTP');
            return res
                .status(400)
                .json({ success: false, message: "Phone number and OTP are required" });
        }
        // Validate OTP
        if (otp !== TEMP_OTP) {
            console.log('Invalid OTP provided:', otp, 'Expected:', TEMP_OTP);
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        // Find user
        console.log('Searching for user with phoneNumber:', phoneNumber);
        const user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            console.log('User not found in database');
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log('User found:', { id: user.id, phoneNumber: user.phoneNumber });
        // Generate JWT
        console.log('Generating JWT token');
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "24h",
        });
        console.log('Login successful, preparing response');
        const responseData = {
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        };
        console.log('Sending response:', responseData);
        return res.status(200).json(responseData);
    }
    catch (err) {
        console.error("=== LOGIN CONTROLLER ERROR ===", err);
        return res.status(500).json({
            success: false,
            message: "Error during login",
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};
export const getProfile = async (req, res) => {
    console.log('=== GET PROFILE CONTROLLER START ===');
    try {
        const userId = req.user?.userId;
        if (!userId) {
            console.log('No userId found in request');
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        console.log('Fetching profile for userId:', userId);
        const user = await User.findByPk(userId);
        if (!user) {
            console.log('User not found for userId:', userId);
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log('Profile fetched successfully');
        return res.json({
            success: true,
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                state: user.state,
                district: user.district,
                profilePicture: user.profilePicture,
            }
        });
    }
    catch (err) {
        console.error("Error fetching profile:", err);
        return res.status(500).json({ success: false, message: "Error fetching profile", error: err });
    }
};
export const updateProfile = async (req, res) => {
    console.log('=== UPDATE PROFILE CONTROLLER START ===');
    try {
        const userId = req.user?.userId;
        if (!userId) {
            console.log('No userId found in request');
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { username, email } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            console.log('User not found for userId:', userId);
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let profilePictureUrl = user.profilePicture;
        // Handle file upload if a new image is provided
        if (req.file) {
            console.log('Processing profile picture upload');
            const extension = req.file.mimetype.split("/")[1];
            const username = (req.body.username || user.username || '').replace(/\s+/g, '_');
            const userId = user.id;
            const customFilename = `tractorProfilePicture_${username}_${userId}.${extension}`;
            const destPath = `uploads/profilePicture/${customFilename}`;
            fs.renameSync(req.file.path, destPath);
            profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/profilePicture/${customFilename}`;
        }
        await user.update({
            username: username || user.username,
            email: email || user.email,
            profilePicture: profilePictureUrl,
        });
        console.log('Profile updated successfully');
        return res.json({ success: true, message: "Profile updated successfully", user });
    }
    catch (err) {
        console.error("Profile update failed:", err);
        return res.status(500).json({ success: false, message: "Error updating profile", error: err });
    }
};
export const createTractor = async (req, res) => {
    console.log('=== CREATE TRACTOR CONTROLLER START ===');
    try {
        const userId = req.user?.userId;
        if (!userId) {
            console.log('No userId found in request');
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const tractorData = {
            ...req.body,
            userId,
        };
        console.log('Creating tractor with data:', tractorData);
        const tractor = await Product.create(tractorData);
        console.log('Tractor created successfully');
        return res.status(201).json({ success: true, tractor });
    }
    catch (err) {
        console.error("Tractor creation failed:", err);
        return res.status(500).json({ success: false, message: "Error creating tractor", error: err });
    }
};
export const getTractors = async (req, res) => {
    console.log('=== GET TRACTORS CONTROLLER START ===');
    try {
        const userId = req.user?.userId;
        if (!userId) {
            console.log('No userId found in request');
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        console.log('Fetching tractors for userId:', userId);
        const tractors = await Product.findAll({ where: { userId } });
        console.log('Found tractors:', tractors.length);
        return res.json({ success: true, tractors });
    }
    catch (err) {
        console.error("Error fetching tractors:", err);
        return res.status(500).json({ success: false, message: "Error fetching tractors", error: err });
    }
};
export const getAllTractors = async (_req, res) => {
    try {
        const tractors = await Product.findAll();
        return res.json({ success: true, tractors });
    }
    catch (err) {
        console.error("Error fetching all tractors:", err);
        return res.status(500).json({ success: false, message: "Error fetching tractors", error: err });
    }
};
export const updateUserById = async (req, res) => {
    console.log('=== UPDATE USER BY ID CONTROLLER START ===');
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Accept all updatable fields
        const { username, email, name, state, district } = req.body;
        let profilePictureUrl = user.profilePicture;
        // Handle file upload if a new image is provided
        if (req.file) {
            const extension = req.file.mimetype.split("/")[1];
            const username = (req.body.username || user.username || '').replace(/\s+/g, '_');
            const userId = user.id;
            const customFilename = `tractorProfilePicture_${username}_${userId}.${extension}`;
            const destPath = `uploads/profilePicture/${customFilename}`;
            fs.renameSync(req.file.path, destPath);
            profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/profilePicture/${customFilename}`;
        }
        await user.update({
            username: username || user.username,
            email: email || user.email,
            name: name || user.name,
            state: state || user.state,
            district: district || user.district,
            profilePicture: profilePictureUrl,
        });
        return res.json({ success: true, message: "User updated successfully", user });
    }
    catch (err) {
        console.error("Update user by ID failed:", err);
        return res.status(500).json({ success: false, message: "Error updating user", error: err });
    }
};
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, user });
    }
    catch (err) {
        console.error("Error fetching user by ID:", err);
        return res.status(500).json({ success: false, message: "Error fetching user", error: err });
    }
};
