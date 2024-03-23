import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'team member'],
        required: true,
    },
});

export default model('User', userSchema);
