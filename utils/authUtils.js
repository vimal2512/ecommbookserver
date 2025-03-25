import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Helper function to generate a JWT token for the user
 * @param {String} userId - The user ID to encode in the token
 * @returns {String} - The generated JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
