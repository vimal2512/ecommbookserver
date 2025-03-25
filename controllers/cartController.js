import * as cartService from '../services/cartService.js';

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!bookId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid bookId or quantity' });
    }

    const cart = await cartService.addToCart(userId, bookId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const cart = await cartService.removeFromCart(userId, bookId);
    res.status(200).json({ success: true, message: 'Book removed from cart', cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cartData = await cartService.getCart(req.user.id);
    if (!cartData) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear user's cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.clearCart(userId);
    res.status(200).json({ success: true, message: 'Cart cleared', cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Find and update the cart item
    const updatedCartItem = await Cart.findOneAndUpdate(
      { 'items._id': cartItemId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart item updated successfully', updatedCartItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};
