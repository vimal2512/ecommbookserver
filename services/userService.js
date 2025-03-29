// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();
// const API_URL = 'http://localhost:5000/api/users'

// // Generate JWT Token
// export const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// export const registerUserService = async (userData) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, userData);
//     return response.data;
//   } catch (error) {
//     console.error('Registration Error:', error.response?.data?.message || error.message);
//     throw error.response?.data || { message: 'Registration failed' };
//   }
// };


// export const loginUserService = async (userData) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, userData);
//     return response.data;
//   } catch (error) {
//     console.error('Login Error:', error.response?.data?.message || error.message);
//     throw error.response?.data || { message: 'Login failed' };
//   }
// };

// // Get user profile
// export const getUserProfileService = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new Error('User not found');
//   }
//   return {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   };
// };

// // Update user profile
// export const updateUserProfileService = async (userId, updatedData) => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new Error('User not found');
//   }

//   user.name = updatedData.name || user.name;
//   user.email = updatedData.email || user.email;
//   if (updatedData.password) {
//     user.password = updatedData.password;
//   }

//   await user.save();
//   return { message: 'Profile updated successfully' };
// };

// // Get all users (Admin)
// export const getAllUsersService = async () => {
//   return await User.find({});
// };

// // Delete user (Admin)
// export const deleteUserService = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new Error('User not found');
//   }
//   await user.remove();
//   return { message: 'User deleted successfully' };
// };

// //logout user
// export const logoutUser = () => {
//   localStorage.removeItem('userInfo'); // Remove token from localStorage
// };

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config;

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register a new user
export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  // Create new user
  const user = new User({ name, email, password, role });

  // Save user
  await user.save();

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

// Login user
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id, user.role);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

// Get user by ID
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Update user profile
export const updateUserProfile = async (userId, updatedData) => {
  const { name, email, password, role } = updatedData;

  if (!name || !email || !password || !role) {
    throw new Error('All fields are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email, password: hashedPassword, role },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};

// Delete user
export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return { message: 'User deleted successfully' };
};

// Get all users
export const getAllUsers = async () => {
  const users = await User.find().select('-password');
  return users;
};
