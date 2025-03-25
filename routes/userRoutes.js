import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} from '../controllers/userController.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);
router.get('/', authenticateUser, authorizeAdmin, getAllUsers);
router.delete('/:userId', authenticateUser, authorizeAdmin, deleteUser);

export default router;
