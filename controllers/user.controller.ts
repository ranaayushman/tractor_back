import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { imagekit } from "../config/imagekit.js";
import jwt from "jsonwebtoken";
import { Items } from "../models/items.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Temporary OTP for development
const TEMP_OTP = "123456";

export const createUser = async (req: Request, res: Response) => {
  try {
    let profilePictureUrl: string | undefined;

    if (req.file) {
      const extension = req.file.mimetype.split("/")[1];
      const uniqueFilename = `profile_${Date.now()}.${extension}`;

      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: uniqueFilename,
        folder: "/Home/profilePicture",
        useUniqueFileName: true,
      });

      profilePictureUrl = uploaded.url;
    }

    const user = await User.create({
      phoneNumber: req.body.phoneNumber,
      username: req.body.username,
      email: req.body.email,
      profilePicture: profilePictureUrl,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error("User creation failed:", err);
    res.status(500).json({ message: "Error creating user", error: err });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res
        .status(400)
        .json({ message: "Phone number and OTP are required" });
    }

    if (otp !== TEMP_OTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ phoneNumber });

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user.id, phoneNumber: user.phoneNumber },
    });
  } catch (err) {
    console.error("Signup failed:", err);
    res.status(500).json({ message: "Error during signup", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res
        .status(400)
        .json({ message: "Phone number and OTP are required" });
    }

    if (otp !== TEMP_OTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Find user
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Error during login", error: err });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { username, email } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profilePictureUrl = user.profilePicture;

    // Handle file upload if a new image is provided
    if (req.file) {
      const extension = req.file.mimetype.split("/")[1];
      const uniqueFilename = `profile_${Date.now()}.${extension}`;

      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: uniqueFilename,
        folder: "/Home/profilePicture",
        useUniqueFileName: true,
      });

      profilePictureUrl = uploaded.url;
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      profilePicture: profilePictureUrl,
    });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update failed:", err);
    res.status(500).json({ message: "Error updating profile", error: err });
  }
};

export const createTractor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId; // Will be set by auth middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tractorData = {
      ...req.body,
      userId, // Associate tractor with user
    };

    const tractor = await Items.create(tractorData);
    res.status(201).json(tractor);
  } catch (err) {
    console.error("Tractor creation failed:", err);
    res.status(500).json({ message: "Error creating tractor", error: err });
  }
};

export const getTractors = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId; // Will be set by auth middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tractors = await Items.findAll({ where: { userId } });
    res.json(tractors);
  } catch (err) {
    console.error("Error fetching tractors:", err);
    res.status(500).json({ message: "Error fetching tractors", error: err });
  }
};
