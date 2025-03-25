
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import errorHandler from './middlewares/errorMiddleware.js';
import {authenticateUser} from './middlewares/authMiddleware.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', authenticateUser, orderRoutes);
app.use('/api/cart', authenticateUser, cartRoutes);
app.use('/api/books', bookRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect to MongoDB
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment variables');
  process.exit(1);
}

const connectDB = async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB Connected');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  };

  connectDB();

  // Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

