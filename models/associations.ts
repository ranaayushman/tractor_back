import { Product } from './products.model.js';
import { User } from './user.model.js';
import { ProductImage } from './productImages.model.js';

// Define associations
Product.belongsTo(User, {
    foreignKey: 'userId',
    as: 'seller'
});

User.hasMany(Product, {
    foreignKey: 'userId',
    as: 'products'
});

// Product-ProductImage association
Product.hasMany(ProductImage, {
    foreignKey: 'productId',
    as: 'images',
    onDelete: 'CASCADE',
});
ProductImage.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
});

export const setupAssociations = () => {
    console.log('Database associations have been set up');
};
export { Product, User, ProductImage };