import { Product } from './products.model.js';
import { User } from './user.model.js';
import { ProductImage } from './productImages.model.js';
import { OTP } from './otp.model.js';

// Remove duplicate association definitions from this file. Only associations.js should define associations

// Import and run associations
import './associations.js';

// Only export models
export { Product, User, ProductImage, OTP };