import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    changes:{
        type:Object,
        default:{}
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },
    },{timestamps:true});

const Review = mongoose.model('Review', reviewSchema);
export default Review;