import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv'

dotenv.config();

export const authenticateUser = async (req, res, next) => {
  console.log(" Received Headers:", req.headers);

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/.test(authHeader)) {
    console.log(" No valid token provided");
    return res.status(401).json({ message: "No valid token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log(" Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token Verified:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🚨 JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(401).json({ message: "Token verification failed" });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    console.log("Unauthorized access attempt: No user found in request");
    return res.status(401).json({ message: "User authentication required" });
  }

  if (!req.user.isAdmin) {
    console.log(` Access Denied: User ${req.user._id} attempted to access admin route`);
    return res.status(403).json({ message: "Admin access required" });
  }

  console.log(`Admin Access Granted: User ${req.user._id}`);
  next();
};
