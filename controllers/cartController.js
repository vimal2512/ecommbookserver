import * as cartService from '../services/cartService.js';

export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    if (!bookId || !quantity || quantity < 1) return res.status(400).json({ message: 'Invalid input' });

    const cart = await cartService.addToCart(req.user.id, bookId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json(cart || { message: 'Cart is empty' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await cartService.removeFromCart(req.user.id, req.params.bookId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ message: 'Invalid quantity' });

    const cart = await cartService.updateCartItem(req.user.id, req.params.bookId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
