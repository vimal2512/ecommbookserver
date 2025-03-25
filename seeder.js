import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const INITIAL_BOOK_LIST = [
    { 
      id:1,
      title: "The Alchemist",
      author: "Paulo Coelho",
      price: 299,
      category: "Fiction",
      image: "https://m.media-amazon.com/images/I/71aFt4+OTOL.AC_UF1000,1000_QL80.jpg",
      description: "A young shepherd named Santiago embarks on a journey to discover his personal legend, learning about love, destiny, and the power of dreams along the way.",
      authorBio: "Paulo Coelho is a Brazilian novelist, best known for 'The Alchemist'.",
      reviews: []
    },
    {
      id:2,
      title: "Atomic Habits",
      author: "James Clear",
      price: 199,
      category: "Self-Help",
      image: "https://m.media-amazon.com/images/I/91bYsX41DVL.AC_UF1000,1000_QL80.jpg",
      description: "A powerful guide to building good habits and breaking bad ones using small, consistent changes that lead to remarkable results.",
      authorBio: "James Clear is a habits expert and author of the bestseller 'Atomic Habits'.",
      reviews: []
    },
    {
      id:3,
      title: "The 5 AM Club",
      author: "Robin Sharma",
      price: 399,
      category: "Self-Help",
      image: "https://m.media-amazon.com/images/I/71zytzrg6lL.AC_UF1000,1000_QL80.jpg",
      description: "A self-improvement book that advocates waking up early to maximize productivity, improve health, and achieve long-term success.",
      authorBio: "Robin Sharma is a leadership expert and author of 'The Monk Who Sold His Ferrari'.",
      reviews: []
    },
    { 
      id:4,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      price: 299,
      category: "History",
      image: "https://m.media-amazon.com/images/I/713jIoMO3UL.AC_UF1000,1000_QL80.jpg",
      description: "Explores the history of human civilization, from the Stone Age to modern times, uncovering how biology and culture shaped the world.",
      authorBio: "Yuval Noah Harari is an Israeli historian and author of 'Sapiens'.",
      reviews: []
    },
    {
      id:5,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: 99,
      category: "Thriller",
      image: "https://m.media-amazon.com/images/I/81nzxODnaJL.AC_UF1000,1000_QL80.jpg",
      description: "A psychological thriller about a woman who stops speaking after allegedly murdering her husband, and the therapist determined to uncover the truth.",
      authorBio: "Alex Michaelides is a British-Cypriot author known for 'The Silent Patient'.",
      reviews: []
    },
    {
      id:6,
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      price: 499,
      category: "Finance",
      image: "https://m.media-amazon.com/images/I/81bsw6fnUiL.AC_UF1000,1000_QL80.jpg",
      description: "A personal finance classic that contrasts the money mindsets of two father figures, teaching financial independence and investment strategies.",
      authorBio: "Robert Kiyosaki is an entrepreneur and author of 'Rich Dad Poor Dad'.",
      reviews: []
    }
  ];
  
// MongoDB Connection
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected for Seeding');

    // Clear existing data
    await Book.deleteMany();
    console.log('🗑️ Existing books removed');

    // Insert new books
    await Book.insertMany(INITIAL_BOOK_LIST);
    console.log('📚 Books Seeded Successfully');

    // Disconnect after completion
    mongoose.connection.close();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};

// Execute Seeder
seedDatabase();
