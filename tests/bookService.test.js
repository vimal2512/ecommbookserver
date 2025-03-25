import Book from '../models/Book.js';
import { getBookById, getAllBooks, createBook } from '../services/bookService.js';
import { jest } from '@jest/globals';

jest.mock('../models/Book.js');

describe('Book Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve a book by ID', async () => {
    const mockBook = { _id: 'book123', title: 'Test Book', price: 10 };
    Book.findById = jest.fn().mockResolvedValue(mockBook);

    const result = await getBookById('book123');
    expect(result).toEqual(mockBook);
  });

  test('should fail to retrieve a non-existent book', async () => {
    Book.findById = jest.fn().mockResolvedValue(null);
    await expect(getBookById('invalidId')).rejects.toThrow('Book not found');
  });

  test('should retrieve all books', async () => {
    const mockBooks = [
      { _id: 'book1', title: 'Book One', price: 15 },
      { _id: 'book2', title: 'Book Two', price: 20 }
    ];
    Book.find = jest.fn().mockResolvedValue(mockBooks);

    const result = await getAllBooks();
    expect(result).toEqual(mockBooks);
  });

  test('should create a new book', async () => {
    const bookData = { title: 'New Book', price: 30 };
    const mockBook = { _id: 'book456', ...bookData };
    Book.prototype.save = jest.fn().mockResolvedValue(mockBook);

    const result = await createBook(bookData);
    expect(result).toEqual(mockBook);
  });

  test('should fail to create a book with missing data', async () => {
    await expect(createBook({})).rejects.toThrow('Invalid book data');
  });
});
