import { Router, Request, Response } from 'express';
import Rating from '../models/Rating';

const router = Router();

// POST /api/ratings - Create a new rating
router.post('/', async (req: Request, res: Response) => {
    try {
        const { email, rating, comments } = req.body;

        // Validation
        if (!email || typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Email is required and must be a valid string',
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
            });
        }

        if (!rating || typeof rating !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Rating is required and must be a number',
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }

        // Check comments length
        if (comments && typeof comments === 'string' && comments.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Comments cannot exceed 1000 characters',
            });
        }

        // Create new rating with sanitized data
        const newRating = new Rating({
            email: email.trim().toLowerCase(),
            rating: Math.floor(rating), // Ensure integer
            comments: comments ? comments.trim() : '',
        });

        await newRating.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback!',
            data: {
                id: newRating._id,
                email: newRating.email,
                rating: newRating.rating,
            },
        });
    } catch (error: any) {
        console.error('Error creating rating:', error);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: Object.values(error.errors).map((e: any) => e.message).join(', '),
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to submit rating',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
});

// GET /api/ratings - Get all ratings (optional, for admin)
router.get('/', async (req: Request, res: Response) => {
    try {
        const ratings = await Rating.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: ratings.length,
            data: ratings,
        });
    } catch (error: any) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ratings',
            error: error.message,
        });
    }
});

export default router;
