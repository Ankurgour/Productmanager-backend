import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/auth.js';
import fetch from 'node-fetch';
import Product from './models/Product.js';
import path from 'path';
import { fileURLToPath } from 'url'; 
import productRouter from './routes/product.js'
import reviewRoutes from './routes/review.js';

const __filename = fileURLToPath(import.meta.url); // Get current file's path
const __dirname = path.dirname(__filename);
// import registerRoute from '../controller/User.js


dotenv.config();
const app = express();

app.use(cors(
  {
    origin: '*',
    credentials:'true'
  }
));
app.use(cookieParser());
app.use(express.json());
const PORT = 5000;
console.log("port",PORT);


app.use('/api',router);
app.use('/api',productRouter);
app.use('/api/review',reviewRoutes);


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
