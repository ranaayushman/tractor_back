import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { imagekit } from "../config/imagekit.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    let profilePictureUrl: string | null = null;

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
