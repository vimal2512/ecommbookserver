import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, addToCart);
router.get('/', authenticateUser, getCart);
router.put('/:cartItemId', authenticateUser, updateCartItem);
router.delete('/:cartItemId', authenticateUser, removeFromCart);

export default router;
