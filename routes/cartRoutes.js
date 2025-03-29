import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', addToCart);
router.get('/', getCart);
router.put('/:cartItemId', authenticateUser, updateCartItem);
router.delete('/:cartItemId', authenticateUser, removeFromCart);

export default router;
