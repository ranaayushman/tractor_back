import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { DB_USER, DB_HOST, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

if (!DB_USER) {
  throw new Error('DB_USER environment variable is not set');
}

if (!DB_HOST) {
  throw new Error('DB_HOST environment variable is not set');
}

if (typeof DB_PASSWORD !== 'string' || DB_PASSWORD.trim() === '') {
  throw new Error('DB_PASSWORD environment variable must be set and non-empty.');
}

const port = Number(DB_PORT);
export const sequelize = new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST as string,
    port: isNaN(port) ? 3306 : port,
    dialect: 'mysql',
    logging: true,
  }
);
