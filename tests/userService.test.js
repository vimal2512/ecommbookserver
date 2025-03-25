import User, { validateUser } from '../models/User.js';
import { jest } from '@jest/globals';
import { registerUser, getUserById } from '../services/userService.js';

jest.mock('../models/User.js');

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should register a new user', async () => {
    const mockUser = { email: 'test@example.com', password: 'password123' };
    User.prototype.save = jest.fn().mockResolvedValue(mockUser);
    User.findOne = jest.fn().mockResolvedValue(null);
    validateUser.mockReturnValue({ error: null });

    const result = await registerUser(mockUser);
    expect(result).toEqual(mockUser);
  });

  test('should fail to register a user with an existing email', async () => {
    User.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });
    validateUser.mockReturnValue({ error: null });
    await expect(registerUser({ email: 'test@example.com', password: 'password123' })).rejects.toThrow('Email already in use');
  });

  test('should fail validation on invalid user data', async () => {
    validateUser.mockReturnValue({ error: { details: [{ message: 'Invalid email' }] } });
    await expect(registerUser({ email: '', password: 'password123' })).rejects.toThrow('Invalid email');
  });

  test('should retrieve a user by ID', async () => {
    const mockUser = { _id: 'user123', email: 'test@example.com' };
    User.findById = jest.fn().mockResolvedValue(mockUser);

    const result = await getUserById('user123');
    expect(result).toEqual(mockUser);
  });

  test('should fail to retrieve a non-existent user', async () => {
    User.findById = jest.fn().mockResolvedValue(null);
    await expect(getUserById('invalidId')).rejects.toThrow('User not found');
  });
});
