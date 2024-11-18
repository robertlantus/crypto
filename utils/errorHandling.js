// utils/errorHandler.js

export const handleErrorResponse = (res, statusCode, message, error = null) => {
    if (error) {
        console.error(message, error);
    }
    res.status(statusCode).json({ 
        message, 
        error: error ? error.message : undefined });
};