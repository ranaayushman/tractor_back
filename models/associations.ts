import { Product } from './products.model.js';
import { User } from './user.model.js';

// Define associations
Product.belongsTo(User, {
    foreignKey: 'userId',
    as: 'seller'
});

User.hasMany(Product, {
    foreignKey: 'userId',
    as: 'products'
});

export const setupAssociations = () => {
    console.log('Database associations have been set up');
};
export { Product, User };