import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
    eventType: string;
    eventDate?: string;
    guestCount?: string;
    budget?: string;
    name: string;
    email: string;
    phone?: string;
    details?: string;
    createdAt: Date;
}

const QuizSchema: Schema = new Schema({
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        trim: true,
    },
    eventDate: {
        type: String,
        trim: true,
    },
    guestCount: {
        type: String,
        trim: true,
    },
    budget: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
        type: String,
        trim: true,
    },
    details: {
        type: String,
        trim: true,
        maxlength: [2000, 'Details cannot exceed 2000 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
