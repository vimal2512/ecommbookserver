import * as bookService from '../services/bookService.js';

export const createBook = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ success: false, message: "Request body must be a non-empty array of books." });
    }

    const books = await bookService.createBooks(req.body);
    res.status(201).json({ success: true, message: "Books created successfully", books });

  } catch (error) {
    console.error("Error creating books:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getBookById = async (req, res) => {
  console.log("Fetching book from DB for ID:", req.params.id);
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Book updated successfully', book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await bookService.deleteBook(req.params.id);
    res.status(200).json({ success: true, message: 'Book deleted successfully', book });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
      const books = await bookService.getAllBooks(req.query.search);
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};