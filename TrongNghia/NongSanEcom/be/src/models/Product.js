import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  unit: { type: String, required: true },
  origin: { type: String },
  discount: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product; 