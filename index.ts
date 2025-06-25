import express from 'express';
import cors from 'cors';
import { sequelize } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import sellRoutes from './routes/sell.routes.js';
import itemsRoutes from './routes/items.routes.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/sell', sellRoutes);
app.use('/api/v1/items', itemsRoutes);

// Serve uploads directory as static files
app.use('/uploads', express.static(path.join(process.cwd(), 'tractor_backend', 'uploads')));

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `${req.method} ${req.originalUrl} is not a valid endpoint`
    });
});

const PORT = process.env.PORT ;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
})();