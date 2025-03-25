import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { createOrder, getOrderById, checkoutOrder } from '../services/orderService.js';
import { jest } from '@jest/globals';

jest.mock('../models/Order.js');
jest.mock('../models/Cart.js');

describe('Order Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create an order successfully', async () => {
    const orderData = {
      user: 'user123',
      items: [{ book: { price: 10 }, quantity: 2 }]
    };
    const mockOrder = { ...orderData, totalAmount: 20 };
    Order.prototype.save = jest.fn().mockResolvedValue(mockOrder);

    const result = await createOrder(orderData);
    expect(result).toEqual(mockOrder);
  });

  test('should fail to create an order with invalid data', async () => {
    await expect(createOrder({})).rejects.toThrow('Invalid order data');
  });

  test('should get an order by ID', async () => {
    const mockOrder = { _id: 'order123', user: 'user123', items: [] };
    Order.findById = jest.fn().mockResolvedValue(mockOrder);

    const result = await getOrderById('order123');
    expect(result).toEqual(mockOrder);
  });

  test('should fail to get a non-existent order', async () => {
    Order.findById = jest.fn().mockResolvedValue(null);
    await expect(getOrderById('invalidOrderId')).rejects.toThrow('Order not found');
  });

  test('should checkout an order successfully', async () => {
    const mockCart = {
      user: 'user123',
      items: [{ book: { price: 10 }, quantity: 2 }]
    };
    const mockOrder = {
      user: 'user123',
      items: mockCart.items,
      totalAmount: 25.99,
      status: 'Processing'
    };
    
    Cart.findOne = jest.fn().mockResolvedValue(mockCart);
    Order.prototype.save = jest.fn().mockResolvedValue(mockOrder);
    Cart.findOneAndDelete = jest.fn().mockResolvedValue(null);

    const result = await checkoutOrder('user123');
    expect(result).toEqual(mockOrder);
  });

  test('should fail checkout if cart is empty', async () => {
    Cart.findOne = jest.fn().mockResolvedValue(null);
    await expect(checkoutOrder('user123')).rejects.toThrow('Cart is empty');
  });
});
