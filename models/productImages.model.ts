import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Product } from './products.model.js';

interface ProductImageAttributes {
  id: number;
  productId: number;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductImageCreationAttributes extends Optional<ProductImageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export const ProductImage = sequelize.define<Model<ProductImageAttributes, ProductImageCreationAttributes>>('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
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
