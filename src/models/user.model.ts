import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';

interface UserAttributes {
    id: number;
    phoneNumber: string;
    username?: string;
    email?: string;
    profilePicture?: string;
    name?: string;
    state?: string;
    district?: string;
}

// These are the attributes needed for creating a new User
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

// This is the type of our User model
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare phoneNumber: string;
    declare username?: string;
    declare email?: string;
    declare profilePicture?: string;
    declare name?: string;
    declare state?: string;
    declare district?: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'User',
});
