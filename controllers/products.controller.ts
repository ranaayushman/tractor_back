import { Request, Response } from "express";
import { Product, User, ProductImage } from "../models/index.js";
import fs from "fs";

// CREATE product (auth required)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      if (req.files.length < 1) {
        return res
          .status(400)
          .json({ message: "At least 1 image is required" });
      }
      if (req.files.length > 20) {
        return res.status(400).json({ message: "Maximum 20 images allowed" });
      }
      let idx = 0;
      for (const file of req.files) {
        const extension = file.mimetype.split("/")[1];
        const customFilename = `product_${userId}_${idx}.${extension}`;
        const destPath = `uploads/products/${customFilename}`;
        fs.renameSync(file.path, destPath);
        imageUrls.push(
          `${req.protocol}://${req.get(
            "host"
          )}/uploads/products/${customFilename}`
        );
        idx++;
      }
    } else {
      return res.status(400).json({ message: "At least 1 image is required" });
    }
    const productData = {
      userId,
      productType: req.body.productType,
      title: req.body.title,
      brand: req.body.brand,
      modelYear: req.body.modelYear,
      owner: req.body.owner,
      description: req.body.description,
      location: req.body.location,
      videoUrl: req.body.videoUrl,
      price: req.body.price,
      status: req.body.status || "active",
    };
    const product = await Product.create(productData);
    const productId = product.getDataValue('id');
    // Save images in ProductImage table
    const imageRecords = await Promise.all(imageUrls.map((url: string) => ProductImage.create({ productId, url })));
    // Attach images to response for compatibility
    const prodWithImages: any = product.toJSON();
    prodWithImages.images = imageRecords.map((img: any) => img.getDataValue('url'));
    res.status(201).json(prodWithImages);
  } catch (err) {
    console.error("Product creation failed:", err);
    res.status(500).json({ message: "Error creating product", error: err });
  }
};

// GET all products (public) - with seller info and images
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: User,
          as: "seller",
          attributes: [
            "id",
            "name",
            "phoneNumber",
            "email",
            "profilePicture",
            "state",
            "district",
          ],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["url"],
        },
      ],
    });
    // Flatten images for compatibility
    const result = products.map(p => {
      const obj = p.toJSON();
      (obj as any).images = ((obj as any).images || []).map((img: any) => img.url);
      return obj;
    });
    res.json(result);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products", error: err });
  }
};

// GET product by id (public) - with seller info and images
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "seller",
          attributes: [
            "id",
            "name",
            "phoneNumber",
            "email",
            "profilePicture",
            "state",
            "district",
          ],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["url"],
        },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const obj = product.toJSON();
    (obj as any).images = ((obj as any).images || []).map((img: any) => img.url);
    res.json(obj);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Error fetching product", error: err });
  }
};

// UPDATE product (auth required)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const product = await Product.findOne({
      where: { id: req.params.id, userId },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let imageUrls = [];
    // 1. Get kept images from the form (from the frontend)
    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        imageUrls = req.body.existingImages;
      } else if (typeof req.body.existingImages === "string") {
        imageUrls = [req.body.existingImages];
      }
    } else {
      imageUrls = (product.get("images") as string[]) || [];
    }

    // 2. Add new uploads
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      if (req.files.length > 20) {
        return res.status(400).json({ message: "Maximum 20 images allowed" });
      }
      let idx2 = 0;
      for (const file of req.files) {
        const extension = file.mimetype.split("/")[1];
        const customFilename = `product_${userId}_${Date.now()}_${idx2}.${extension}`;
        const destPath = `uploads/products/${customFilename}`;
        fs.renameSync(file.path, destPath);
        imageUrls.push(
          `${req.protocol}://${req.get(
            "host"
          )}/uploads/products/${customFilename}`
        );
        idx2++;
      }
    }
    // Remove all old images from ProductImage and add new ones
    // Use product.getDataValue('id') to get the id
    const productId = product.getDataValue('id');
    const imageRecords = await Promise.all(imageUrls.map((url: string) => ProductImage.create({ productId, url })));
    // Attach images to response for compatibility
    const prodWithImages: any = product.toJSON();
    prodWithImages.images = imageRecords.map((img: any) => img.getDataValue('url'));
    res.status(201).json(prodWithImages);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Error updating product", error: err });
  }
};

// DELETE product (auth required)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const product = await Product.findOne({
      where: { id: req.params.id, userId },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product", error: err });
  }
};

// GET products by userId (public) - with seller info and images
export const getProductsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const products = await Product.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "seller",
          attributes: [
            "id",
            "name",
            "phoneNumber",
            "email",
            "profilePicture",
            "state",
            "district",
          ],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["url"],
        },
      ],
    });
    const result = products.map(p => {
      const obj = p.toJSON();
      (obj as any).images = ((obj as any).images || []).map((img: any) => img.url);
      return obj;
    });
    res.json(result);
  } catch (err) {
    console.error("Error fetching products by userId:", err);
    res
      .status(500)
      .json({ message: "Error fetching products by userId", error: err });
  }
};
