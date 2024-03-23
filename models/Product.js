import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  description :{ type: String},
  department: { type: String, required: true},
  id:{type:Number, required: true}

});

export default mongoose.model('Product', productSchema);
