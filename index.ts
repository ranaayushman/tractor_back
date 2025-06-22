import express from 'express';
import { sequelize } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import sellRoutes from './routes/sell.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/v1', userRoutes);
app.use('/api/v1/sell', sellRoutes);

const PORT = process.env.PORT;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})(); 