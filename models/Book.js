import mongoose from 'mongoose';
import Joi from 'joi';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  authorBio: { type: String },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String }
    }
  ]
}, { timestamps: true });


export const validateBook = (books) => {
  const schema = Joi.array().items(
    Joi.object({
      title: Joi.string().min(3).required(),
      author: Joi.string().min(3).required(),
      price: Joi.number().min(0).required(),
      category: Joi.string().required(),
      image: Joi.string().uri().optional(),
      description: Joi.string().optional(),
      authorBio: Joi.string().optional(),
      reviews: Joi.array().items(
        Joi.object({
          user: Joi.string().required(),
          rating: Joi.number().min(1).max(5).required(),
          comment: Joi.string().optional()
        })
      )
    })
  );

  return schema.validate(books);
};


const Book = mongoose.model('Book', bookSchema);
export default Book;
