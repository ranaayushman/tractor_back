import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';

interface OTPAttributes {
  id: number;
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
  used: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OTPCreationAttributes extends Optional<OTPAttributes, 'id' | 'used' | 'createdAt' | 'updatedAt'> {}

export const OTP = sequelize.define<Model<OTPAttributes, OTPCreationAttributes>>('OTP', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  used: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
