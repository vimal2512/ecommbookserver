import Order from '../models/Order.js';
import Cart from '../models/Cart.js';


export const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate('items.book');
  if (!order) throw new Error('Order not found');
  return order;
};

export const getUserOrders = async (userId) => {
  return await Order.find({ user: userId }).populate('items.book');
};

export const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Error('Order not found');
  if (order.status !== 'Pending') throw new Error('Only pending orders can be canceled');
  order.status = 'Cancelled';
  await order.save();
  return order;
};

export const getAllOrders = async () => {
  return await Order.find().populate('user', 'name email').populate('items.book');
};

export const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['Pending', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) throw new Error('Invalid order status');
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');
  order.status = status;
  await order.save();
  return order;
};

export const checkoutOrder = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.book');
  if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

  const totalAmount = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const order = new Order({
    user: userId,
    items: cart.items.map(item => ({
      book: item.book._id,
      quantity: item.quantity,
      price: item.book.price,
    })),
    totalAmount,
    status: 'Pending',
  });
  await order.save();
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });
  return order;
};

export const createOrder = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.book');
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

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

  await newOrder.save();
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });

  return newOrder;
};


/**
 * Place an order for a user
 * @param {string} userId - The ID of the user placing the order
 * @param {Object} orderData - Additional order details (e.g., shipping address, payment method)
 * @returns {Object} The newly created order
 */
export const placeOrder = async (userId, orderData) => {
  try {
    // Check if user is logged in
    if (!userId) {
      throw new Error('You are not logged in. Please login to place an order.');
    }

    // Get the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.book');

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );

    // Create new order
    const newOrder = new Order({
      user: userId,
      items: cart.items.map(item => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.book.price,
      })),
      totalAmount,
      status: 'Pending',
      shippingAddress: orderData.shippingAddress || '',
      paymentMethod: orderData.paymentMethod || 'COD',
    });

    // Save the order to the database
    await newOrder.save();

    // Clear the user's cart after placing the order
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    return newOrder;
  } catch (error) {
    console.error('Error in placeOrder service:', error);
    throw new Error(error.message || 'Failed to place order');
  }
};
