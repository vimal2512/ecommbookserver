import Cart from '../models/Cart.js';
import { addToCart, getCart, removeFromCart } from '../services/cartService.js';
import { jest } from '@jest/globals';

jest.mock('../models/Cart.js');

describe('Cart Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add an item to the cart', async () => {
    const userId = 'user123';
    const book = { _id: 'book123', price: 20 };
    const mockCart = { user: userId, items: [{ book, quantity: 1 }] };

    Cart.findOneAndUpdate = jest.fn().mockResolvedValue(mockCart);
    const result = await addToCart(userId, book._id, 1);
    expect(result).toEqual(mockCart);
  });

  test('should retrieve a user\'s cart', async () => {
    const userId = 'user123';
    const mockCart = { user: userId, items: [{ book: { _id: 'book123' }, quantity: 2 }] };

    Cart.findOne = jest.fn().mockResolvedValue(mockCart);
    const result = await getCart(userId);
    expect(result).toEqual(mockCart);
  });

  test('should return an empty cart if no cart exists', async () => {
    Cart.findOne = jest.fn().mockResolvedValue(null);
    const result = await getCart('newUser');
    expect(result).toEqual({ items: [] });
  });

  test('should remove an item from the cart', async () => {
    const userId = 'user123';
    const mockCart = { user: userId, items: [] };

    Cart.findOneAndUpdate = jest.fn().mockResolvedValue(mockCart);
    const result = await removeFromCart(userId, 'book123');
    expect(result).toEqual(mockCart);
  });

  test('should fail to remove an item from a non-existent cart', async () => {
    Cart.findOneAndUpdate = jest.fn().mockResolvedValue(null);
    await expect(removeFromCart('user404', 'book123')).rejects.toThrow('Cart not found');
  });
});
