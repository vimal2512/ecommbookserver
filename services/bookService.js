import Book, { validateBook } from '../models/Book.js';

export const createBooks = async (bookDataArray) => {
  // Validate the array of books
  const { error } = validateBook(bookDataArray);
  if (error) throw new Error(error.details.map((d) => d.message).join(', '));

  // Insert all books in bulk
  const books = await Book.insertMany(bookDataArray);
  return books;
};

export const getBookById = async (id) => {
  const book = await Book.findById(id);
  if (!book) throw new Error('Book not found');
  return book;
};

export const updateBook = async (id, updateData) => {
  const book = await Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!book) throw new Error('Book not found');
  return book;
};

export const deleteBook = async (id) => {
  const book = await Book.findByIdAndDelete(id);
  if (!book) throw new Error('Book not found');
  return book;
};

export const getAllBooks = async (search) => {
  try {
      let filter = {};
      if (search) {
          filter = {
              $or: [
                  { title: { $regex: search, $options: 'i' } },
                  { author: { $regex: search, $options: 'i' } },
                  { category: { $regex: search, $options: 'i' } }
              ]
          };
      }
      return await Book.find(filter).select('title author price image');
  } catch (error) {
      throw new Error(error.message);
  }
};
