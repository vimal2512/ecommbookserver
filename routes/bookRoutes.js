import express from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', authenticateUser, authorizeAdmin, updateBook);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteBook);

export default router;
