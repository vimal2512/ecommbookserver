import Cart from '../models/Cart.js';

export const addToCart = async (userId, bookId, quantity) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [{ book: bookId, quantity }] });
  } else {
    const existingItem = cart.items.find((item) => item.book.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ book: bookId, quantity });
    }
  }
  await cart.save();
  return cart;
};

export const getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate('items.book');
};

export const removeFromCart = async (userId, bookId) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { book: bookId } } },
    { new: true }
  );
  return cart;
};

export const clearCart = async (userId) => {
  return await Cart.findOneAndUpdate(
    { user: userId },
    { $set: { items: [] } },
    { new: true }
  );
};

export const updateCartItem = async (userId, bookId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Cart not found');

  const item = cart.items.find((item) => item.book.toString() === bookId);
  if (!item) throw new Error('Item not found in cart');

  item.quantity = quantity;
  await cart.save();
  return cart;
};
