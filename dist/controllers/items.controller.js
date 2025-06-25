import { Items } from "../models/items.model.js";
import { Sell } from "../models/sell.model.js";
import { User } from "../models/user.model.js";
export const getAllItems = async (_req, res) => {
    try {
        const items = await Items.findAll({
            include: [
                {
                    model: Sell,
                    as: 'sell',
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'phoneNumber', 'username', 'email', 'profilePicture', 'name', 'state', 'district']
                }
            ]
        });
        return res.json({ success: true, items });
    }
    catch (err) {
        console.error("Error fetching all items:", err);
        return res.status(500).json({ success: false, message: "Error fetching items", error: err });
    }
};
