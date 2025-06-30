import express from 'express';
import cors from 'cors';
import { sequelize } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import productsRoutes from './routes/products.routes.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for images)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Register routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/sell', productsRoutes);

// DB sync and server start
const PORT = process.env.PORT || 8000;
(async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log('Database synced successfully');
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to sync DB or start server:', err);
  }
})();