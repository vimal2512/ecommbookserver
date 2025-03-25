import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';

dotenv.config();


export const authenticateUser = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    console.log("Token received:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found, invalid token" });
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});


export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};


