import { Router, Request, Response } from 'express';
import Quiz from '../models/Quiz';

const router = Router();

// POST /api/quiz - Create a new quiz submission
router.post('/', async (req: Request, res: Response) => {
    try {
        const { eventType, eventDate, guestCount, budget, name, email, phone, details } = req.body;

        // Validation - Required fields
        if (!eventType || typeof eventType !== 'string' || !eventType.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Event type is required and must be a valid string',
            });
        }

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Name is required and must be a valid string',
            });
        }

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

        // Check details length
        if (details && typeof details === 'string' && details.length > 2000) {
            return res.status(400).json({
                success: false,
                message: 'Details cannot exceed 2000 characters',
            });
        }

        // Create new quiz submission with sanitized data
        const newQuiz = new Quiz({
            eventType: eventType.trim(),
            eventDate: eventDate && typeof eventDate === 'string' ? eventDate.trim() : '',
            guestCount: guestCount && typeof guestCount === 'string' ? guestCount.trim() : '',
            budget: budget && typeof budget === 'string' ? budget.trim() : '',
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone && typeof phone === 'string' ? phone.trim() : '',
            details: details && typeof details === 'string' ? details.trim() : '',
        });

        await newQuiz.save();

        res.status(201).json({
            success: true,
            message: 'Quiz submitted successfully! We will contact you soon.',
            data: {
                id: newQuiz._id,
                eventType: newQuiz.eventType,
                name: newQuiz.name,
                email: newQuiz.email,
            },
        });
    } catch (error: any) {
        console.error('Error creating quiz submission:', error);

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
            message: 'Failed to submit quiz',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
});

// GET /api/quiz - Get all quiz submissions (optional, for admin)
router.get('/', async (req: Request, res: Response) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes,
        });
    } catch (error: any) {
        console.error('Error fetching quiz submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quiz submissions',
            error: error.message,
        });
    }
});

export default router;
