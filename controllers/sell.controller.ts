import { Request, Response } from 'express';
import { Sell } from '../models/sell.model.js';
import { User } from '../models/user.model.js';
import { imagekit } from '../config/imagekit.js';

export const createSell = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let imageUrls: string[] = [];

    // Handle multiple image uploads
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Validate minimum and maximum image count
      if (req.files.length < 1) {
        return res.status(400).json({ message: 'At least 1 image is required' });
      }
      if (req.files.length > 20) {
        return res.status(400).json({ message: 'Maximum 20 images allowed' });
      }

      // Upload each image to ImageKit
      for (const file of req.files) {
        const extension = file.mimetype.split('/')[1];
        const uniqueFilename = `sell_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;

        const uploaded = await imagekit.upload({
          file: file.buffer,
          fileName: uniqueFilename,
          folder: '/Home/sell',
          useUniqueFileName: true,
        });

        imageUrls.push(uploaded.url);
      }
    } else {
      return res.status(400).json({ message: 'At least 1 image is required' });
    }

    const sellData = {
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

    const sell = await Sell.create(sellData);
    res.status(201).json(sell);
  } catch (err) {
    console.error('Sell creation failed:', err);
    res.status(500).json({ message: 'Error creating sell item', error: err });
  }
};

export const getSells = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sells = await Sell.findAll({ where: { userId } });
    res.json(sells);
  } catch (err) {
    console.error('Error fetching sells:', err);
    res.status(500).json({ message: 'Error fetching sell items', error: err });
  }
};

export const getSellById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sell = await Sell.findOne({ 
      where: { 
        id: req.params.id,
        userId 
      } 
    });
    
    if (!sell) {
      return res.status(404).json({ message: 'Sell item not found' });
    }
    
    res.json(sell);
  } catch (err) {
    console.error('Error fetching sell:', err);
    res.status(500).json({ message: 'Error fetching sell item', error: err });
  }
};

export const updateSell = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sell = await Sell.findOne({ 
      where: { 
        id: req.params.id,
        userId 
      } 
    });
    
    if (!sell) {
      return res.status(404).json({ message: 'Sell item not found' });
    }

    let imageUrls = sell.get('images') as string[];
    
    // Handle new image uploads if provided
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Validate maximum image count
      if (req.files.length > 20) {
        return res.status(400).json({ message: 'Maximum 20 images allowed' });
      }

      imageUrls = [];
      for (const file of req.files) {
        const extension = file.mimetype.split('/')[1];
        const uniqueFilename = `sell_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;

        const uploaded = await imagekit.upload({
          file: file.buffer,
          fileName: uniqueFilename,
          folder: '/Home/sell',
          useUniqueFileName: true,
        });

        imageUrls.push(uploaded.url);
      }
    }

    await sell.update({
      productType: req.body.productType || sell.get('productType'),
      title: req.body.title || sell.get('title'),
      brand: req.body.brand || sell.get('brand'),
      modelYear: req.body.modelYear || sell.get('modelYear'),
      owner: req.body.owner || sell.get('owner'),
      description: req.body.description || sell.get('description'),
      location: req.body.location || sell.get('location'),
      videoUrl: req.body.videoUrl || sell.get('videoUrl'),
      images: imageUrls,
      price: req.body.price || sell.get('price'),
      status: req.body.status || sell.get('status'),
    });

    res.json(sell);
  } catch (err) {
    console.error('Error updating sell:', err);
    res.status(500).json({ message: 'Error updating sell item', error: err });
  }
};

export const deleteSell = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sell = await Sell.findOne({ 
      where: { 
        id: req.params.id,
        userId 
      } 
    });
    
    if (!sell) {
      return res.status(404).json({ message: 'Sell item not found' });
    }

    await sell.destroy();
    res.json({ message: 'Sell item deleted successfully' });
  } catch (err) {
    console.error('Error deleting sell:', err);
    res.status(500).json({ message: 'Error deleting sell item', error: err });
  }
}; 