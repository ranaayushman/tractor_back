import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './user.model.js';
import { Items } from './items.model.js';

interface SellAttributes {
  id: number;
  userId: number;
  productType: string;
  title: string;
  brand: string;
  modelYear: string;
  owner: string;
  description: string;
  location: string;
  videoUrl?: string;
  images?: string[];
  price: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SellCreationAttributes extends Optional<SellAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export const Sell = sequelize.define<Model<SellAttributes, SellCreationAttributes>>('Sell', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  productType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modelYear: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Optionally, Items.belongsTo(Sell, { foreignKey: 'productId', targetKey: 'id', as: 'sell' }); 