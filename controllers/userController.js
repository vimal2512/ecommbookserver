import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateUser } from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config()

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


export const registerUser = async (req, res) => {

  // Validate input data
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details.map(err => err.message) });
  }

  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const user = new User({ name, email, password });

  // Save user
  await user.save();

  // Generate JWT token
  const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};


export const loginUser = async (req, res) => {
  console.log("Login Successful:", req.body); // Debugging

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found for email:", email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordCorrect = await user.matchPassword(password);
  console.log("Password match status:", isPasswordCorrect);

  if (user && isPasswordCorrect) {
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    console.log("Incorrect password for email:", email);
    res.status(401).json({ message: 'Invalid email or password' });
  }
};


// Get user details (authenticated)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude password from the response
    res.status(200).json({ user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user details
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User details updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (invalidate token - client-side action)
export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

