import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  placeOrder
} from '../controllers/orderController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createOrder);
router.get('/:orderId', authenticateUser, getOrderById);
router.get('/user/:userId', authenticateUser, getUserOrders);
router.put('/:orderId', authenticateUser, updateOrderStatus);
router.delete('/:orderId', authenticateUser, cancelOrder);
router.post("/", authenticateUser, placeOrder);

export default router;
