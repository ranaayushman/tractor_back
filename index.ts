import express from 'express';
import cors from 'cors';
import { sequelize } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import sellRoutes from './routes/sell.routes.js';
import dotenv from 'dotenv';

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
app.options('*', cors(corsOptions));
app.use(express.json());

// Add logging middleware to debug requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Body:`, req.body);
    next();
});

// Test route
app.get('/api/v1/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Enable routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/sell', sellRoutes);

// Add a catch-all route to debug 404s
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        url: req.originalUrl,
        availableRoutes: [
            'POST /api/v1/signup',
            'POST /api/v1/login',
            'PUT /api/v1/profile',
            'POST /api/v1/tractors',
            'GET /api/v1/tractors',
            'GET /api/v1/test'
        ]
    });
});

// List all registered routes
const listRoutes = (app: any) => {
    console.log('\n=== Registered Routes ===');
    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
            // Routes registered directly on the app
            console.log(`${Object.keys(middleware.route.methods).join(',')} ${middleware.route.path}`);
        } else if (middleware.name === 'router') {
            // Router middleware
            middleware.handle.stack.forEach((handler: any) => {
                if (handler.route) {
                    const path = middleware.regexp.source.replace('\\/?', '').replace('(?=\\/|$)', '');
                    console.log(`${Object.keys(handler.route.methods).join(',')} ${path}${handler.route.path}`);
                }
            });
        }
    });
    console.log('========================\n');
};

const PORT = process.env.PORT || 8080;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            listRoutes(app);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();