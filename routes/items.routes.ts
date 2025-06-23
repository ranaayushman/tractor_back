import { Router } from "express";
import { getAllItems } from "../controllers/items.controller.js";

const router = Router();

// Public route to get all items/products
router.get("/", getAllItems);

export default router; 