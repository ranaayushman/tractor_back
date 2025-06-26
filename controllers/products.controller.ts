import { Request, Response } from 'express';
import { Product } from '../models/products.model.js';
import { User } from '../models/user.model.js';
import fs from 'fs';

// CREATE product (auth required)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      if (req.files.length < 1) {
        return res.status(400).json({ message: 'At least 1 image is required' });
      }
      if (req.files.length > 20) {
        return res.status(400).json({ message: 'Maximum 20 images allowed' });
      }
      let idx = 0;
      for (const file of req.files) {
        const extension = file.mimetype.split('/')[1];
        const customFilename = `product_${userId}_${idx}.${extension}`;
        const destPath = `uploads/products/${customFilename}`;
        fs.renameSync(file.path, destPath);
        imageUrls.push(`${req.protocol}://${req.get('host')}/uploads/products/${customFilename}`);
        idx++;
      }
    } else {
      return res.status(400).json({ message: 'At least 1 image is required' });
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
      images: imageUrls,
      price: req.body.price,
      status: req.body.status || 'active',
    };
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    console.error('Product creation failed:', err);
    res.status(500).json({ message: 'Error creating product', error: err });
  }
};

// GET all products (public)
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
};

// GET product by id (public)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Error fetching product', error: err });
  }
};

// UPDATE product (auth required)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const product = await Product.findOne({ where: { id: req.params.id, userId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    let imageUrls = product.get('images') as string[];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      if (req.files.length > 20) {
        return res.status(400).json({ message: 'Maximum 20 images allowed' });
      }
      imageUrls = [];
      let idx2 = 0;
      for (const file of req.files) {
        const extension = file.mimetype.split('/')[1];
        const customFilename = `product_${userId}_${idx2}.${extension}`;
        const destPath = `uploads/products/${customFilename}`;
        fs.renameSync(file.path, destPath);
        imageUrls.push(`${req.protocol}://${req.get('host')}/uploads/products/${customFilename}`);
        idx2++;
      }
    }
    await product.update({
      productType: req.body.productType || product.get('productType'),
      title: req.body.title || product.get('title'),
      brand: req.body.brand || product.get('brand'),
      modelYear: req.body.modelYear || product.get('modelYear'),
      owner: req.body.owner || product.get('owner'),
      description: req.body.description || product.get('description'),
      location: req.body.location || product.get('location'),
      videoUrl: req.body.videoUrl || product.get('videoUrl'),
      images: imageUrls,
      price: req.body.price || product.get('price'),
      status: req.body.status || product.get('status'),
    });
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Error updating product', error: err });
  }
};

// DELETE product (auth required)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const product = await Product.findOne({ where: { id: req.params.id, userId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
};

// GET products by userId (public)
export const getProductsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const products = await Product.findAll({ where: { userId } });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products by userId:', err);
    res.status(500).json({ message: 'Error fetching products by userId', error: err });
  }
}; 