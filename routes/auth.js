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
        const { email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword, role });

        const token = generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({ message: 'User registered successfully', user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateTokenAndSetCookie(user._id, res);

        res.status(200).json({ message: 'Logged in successfully', role: user.role, token,id:user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
