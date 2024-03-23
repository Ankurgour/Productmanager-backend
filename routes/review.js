import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import isAdminMiddleware from '../middleware/isAdmin.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();



router.post('/submitRequest/:id',async (req, res) => {
    const {id:productId} = req.params;
    
    const {userId,changes} = req.body;
    console.log(userId,changes);
    try {
        const review = new Review({
            productId,
            userId,
            changes
        });
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


router.get('/allRequests',async (req, res) => {

    try {
        let reviews = await Review.find({});
        const pendingCount = await Review.countDocuments({ status: 'pending' });
        const approvedCount = await Review.countDocuments({ status: 'approved' });
        const rejectedCount = await Review.countDocuments({ status: 'rejected' });

        reviews = {
            data: reviews,
            counts: {
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount
            }
        };
        res.status(200).json(reviews);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message });
    }
});

router.get('/mySubmissions/:userId',async (req, res) => {
    const {userId} = req.params;
    try {
        const reviews = await Review.find({userId});
        const pendingCount = await Review.countDocuments({ status: 'pending',userId:userId });
        const approvedCount = await Review.countDocuments({ status: 'approved',userId:userId });
        const rejectedCount = await Review.countDocuments({ status: 'rejected' ,userId:userId});
        const counts = {approvedCount, rejectedCount,pendingCount}
        res.json({submissions:reviews,counts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

router.get('/request/:id',async (req, res) => {
    const {id} = req.params;
    try {
        const review = await Review.findById(id);
        if(!review){
            return res.status(404).json({message:'Review not found'});
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/approveRequest/:id',async (req, res) => {
    const {id} = req.params;
    try {
        const review = await Review.findByIdAndUpdate(id,{status:'approved'},{new:true});
        if(!review){
            return res.status(404).json({message:'Review not found'});
        }

        const producdId = review.productId;
        const changes = review.changes;
        const product = await Product.findByIdAndUpdate(producdId,changes,{new:true});
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }
        

        res.status(201).json({review,product});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

router.patch('/rejectRequest/:id',async (req, res) => {
    const {id} = req.params;
    try {
        const review = await Review.findByIdAndUpdate(id,{status:'rejected'},{new:true});
        if(!review){
            return res.status(404).json({message:'Review not found'});
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);












export default router;