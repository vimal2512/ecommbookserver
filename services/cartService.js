import * as cartService from '../services/cartService.js';

export const addToCart = async (req, res) => {
  try {
      const cart = await cartService.addToCart(req.user.id, req.body.bookId, req.body.quantity);
      res.status(200).json(cart);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const cart = await cartService.removeFromCart(userId, bookId);
    res.status(200).json({ success: true, message: 'Book removed from cart', cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getCart = async (req, res) => {
  try {
      const cartData = await cartService.getCart(req.user.id);
      res.status(200).json(cartData);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.clearCart(userId);
    res.status(200).json({ success: true, message: 'Cart cleared', cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Find the cart item and update its quantity
    const updatedCartItem = await Cart.findByIdAndUpdate(
      cartItemId,
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
