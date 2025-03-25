import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new user
export const registerUserService = async ({ name, email, password, isAdmin }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const newUser = new User({
    name,
    email,
    password, // Will be hashed in schema middleware
    isAdmin: isAdmin || false,
  });

  await newUser.save();

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token: generateToken(newUser._id),
  };
};

// Login user
export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    };
  }
  throw new Error('Invalid email or password');
};

// Get user profile
export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };
};

// Update user profile
export const updateUserProfileService = async (userId, updatedData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.name = updatedData.name || user.name;
  user.email = updatedData.email || user.email;
  if (updatedData.password) {
    user.password = updatedData.password;
  }

  await user.save();
  return { message: 'Profile updated successfully' };
};

// Get all users (Admin)
export const getAllUsersService = async () => {
  return await User.find({});
};

// Delete user (Admin)
export const deleteUserService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  await user.remove();
  return { message: 'User deleted successfully' };
};


