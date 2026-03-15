import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/database';
import ratingsRouter from './routes/ratings';
import quizRouter from './routes/quiz';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
// const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
// Build list of allowed origins
const allowedOrigins = [
    'https://www.msmeventsmanagement.com',
    'https://msmeventsmanagement.com',
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(o => o.trim()) : []),
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman, same-origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    },
    credentials: true,
})); // CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// JSON parsing error handler
app.use((err: any, req: Request, res: Response, next: any) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format',
        });
    }
    next(err);
});

// Routes
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'MSM Events API Server',
        version: '1.0.0',
        endpoints: {
            ratings: '/api/ratings',
            quiz: '/api/quiz',
        },
    });
});

app.use('/api/ratings', ratingsRouter);
app.use('/api/quiz', quizRouter);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// // Start server
// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
//     console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
// });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});


export default app;