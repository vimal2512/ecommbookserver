import * as orderService from '../services/orderService.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

// Place an order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await orderService.placeOrder(userId, req.body);
    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await orderService.cancelOrder(userId, req.params.id);
    res.status(200).json({ success: true, message: 'Order canceled successfully', order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all orders 
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Create an order from cart
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.book');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total price
    const totalAmount = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

    // Create the order
    const newOrder = new Order({
      user: userId,
      items: cart.items.map(item => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.book.price,
      })),
      totalAmount,
      status: 'Pending',
    });

    // Save the order to the database
    await newOrder.save();

    // Clear the user's cart after the order is placed
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Update the status of an order
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    // Find and update the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

// Checkout order
export const checkoutOrder = async (req, res) => {
  try {
    const order = await orderService.checkoutOrder(req.user.id);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
