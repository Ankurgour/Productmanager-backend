import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';

const router = express.Router();
const upload = multer({ dest: 'assets/' }); 

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    // console.log("ise",id);
    try {
    //   const product = await Product.findById(id);
    const product  = await Product.findOne({id:id});
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Route to update a product (including image uploads)
  router.post('/products/:id/update', upload.array('images'), async (req, res) => {
    const { id } = req.params;
    const { name, price, description, department } = req.body;
    const images = req.files.map(file => file.path);
  
    try {
      const product = await Product.findByIdAndUpdate(
        id, 
        { name, price, description, department, images }, 
        { new: true, runValidators: true }
      );
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  export default router;

