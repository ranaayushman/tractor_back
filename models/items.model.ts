import { DataTypes, Model } from 'sequelize';
import { sequelize } from "../config/db.js";
import { User } from './user.model.js';

interface ItemAttributes {
    id: number;
    userId: number;
    tractoreName: string;
    modelNumber: string;
    tractoreImage?: string;
    tractorType: string;
    tractorStatus: string;
}

export const Items = sequelize.define<Model<ItemAttributes>>('Items', {
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
    }
});