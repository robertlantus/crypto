
// mongoConfig.js

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gecko';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');     
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        // Exit the application if the database connection fails
        process.exit(1);
    }
};

// Handle connection events for monitoring

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.log('Mongoose connection error', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown handling for Node process

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose disconnected due to app termination');
    process.exit(0);
});

