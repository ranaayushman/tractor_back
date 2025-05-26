import express from 'express';
import { sequelize } from './config/db.js';
import userRoutes from './routes/user.routes.js';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

const PORT = 3000;

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