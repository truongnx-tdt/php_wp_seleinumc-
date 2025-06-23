import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  images: [{ type: String, required: true }],
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  countInStock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
  unit: { type: String, required: true, enum: ['kg', 'g', 'củ', 'mớ', 'bó', 'trái', 'hộp'] },
  origin: { type: String, required: true },
  isOrganic: { type: Boolean, default: false },
  discount: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product; 