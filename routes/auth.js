import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import generateTokenAndSetCookie from '../utils/generateToken.js';

dotenv.config();
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
        });

        const newUser = await user.save();
        if(!newUser){
            return res.status(404).json({message:'User not found'});
        }
        const token = generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/login', async (req, res) => {
    console.log(req.body.email)
    try {

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }


        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token  = generateTokenAndSetCookie(user._id,res);
        res.status(200).json({ message: 'Logged in successfully', user,token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
