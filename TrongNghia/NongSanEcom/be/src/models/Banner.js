import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  subtitle: { 
    type: String, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  link: { 
    type: String, 
    trim: true 
  },
  linkText: { 
    type: String, 
    trim: true 
  },
  position: { 
    type: String, 
    enum: ['home', 'category', 'product', 'custom'],
    default: 'home'
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  startDate: { 
    type: Date 
  },
  endDate: { 
    type: Date 
  },
  priority: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  backgroundColor: { 
    type: String, 
    default: '#ffffff' 
  },
  textColor: { 
    type: String, 
    default: '#000000' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true 
});

// Index để tối ưu query
bannerSchema.index({ isActive: 1, position: 1, priority: -1 });
bannerSchema.index({ startDate: 1, endDate: 1 });
bannerSchema.index({ category: 1, isActive: 1 });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner; 