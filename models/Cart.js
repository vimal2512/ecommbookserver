import mongoose from 'mongoose';
import Joi from 'joi';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 }
    }
  ]
}, { timestamps: true });

export const validateCart = (cart) => {
  const schema = Joi.object({
    user: Joi.string().hex().length(24).required(),
    items: Joi.array().items(
      Joi.object({
        book: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().min(1).required()
      })
    ).min(1).required()
  });
  return schema.validate(cart, { abortEarly: false });
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
