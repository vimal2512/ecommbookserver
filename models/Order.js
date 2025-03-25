import mongoose from 'mongoose';
import Joi from 'joi';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  shippingCost: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

export const validateOrder = (order) => {
  const schema = Joi.object({
    user: Joi.string().hex().length(24).required(),
    items: Joi.array().items(
      Joi.object({
        book: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().min(1).required()
      })
    ).min(1).required(),
    totalAmount: Joi.number().min(0).required(),
    shippingCost: Joi.number().min(0).required(),
    status: Joi.string().valid('Pending', 'Completed').required()
  });
  return schema.validate(order, { abortEarly: false });
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
