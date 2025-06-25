import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import { User } from './user.model.js';
import { Sell } from './sell.model.js';
export const Items = sequelize.define('Items', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sell,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    tractoreName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modelNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tractoreImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tractorType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tractorStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    brand: {
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
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
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
Items.belongsTo(Sell, { foreignKey: 'productId', as: 'sell' });
Items.belongsTo(User, { foreignKey: 'userId', as: 'user' });
