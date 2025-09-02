const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const AppError = require('./modules/utils/AppError');
const app = express();

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Debug middleware to log request body
app.use((req, res, next) => {
    console.log('Request Body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    next();
});

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const tourRoutes = require('./modules/tour/tour.routes');
const visitorRoutes = require('./modules/visitor/visitor.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const guideRoutes = require('./modules/guide/guide.routes');
const reviewRoutes = require('./modules/review/review.routes');
const bookingRoutes = require('./modules/booking/bookingRoutes');

// MongoDB Connection Configuration
const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.MONGODB_URI.replace(/:([^:@]{4})[^:@]*@/, ':****@')); // Log URI with hidden password

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority'
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Database Name:', conn.connection.name);
        console.log('MongoDB Connection State:', conn.connection.readyState);

        // Handle connection events
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
            console.error('Full error details:', JSON.stringify(err, null, 2));
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (error) {
        console.error('Error connecting to MongoDB. Full error:', error);
        console.error('Stack trace:', error.stack);
        if (error.name === 'MongoServerSelectionError') {
            console.log('Attempting to ping MongoDB servers...');
            try {
                const client = mongoose.connection.getClient();
                await client.db().admin().ping();
            } catch (pingError) {
                console.error('Ping failed:', pingError);
            }
        }
        process.exit(1);
    }
};// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
// 404 handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err);  // Log the error for debugging

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.message = err.message || 'Internal server error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app; 
