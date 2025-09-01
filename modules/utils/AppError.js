class AppError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);

        // Ensure message is a string
        this.message = String(message);

        // Ensure statusCode is a number
        this.statusCode = Number(statusCode) || 500;

        // Set status based on status code
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Add details if provided
        if (details) {
            this.details = details;
        }

        this.isOperational = true;

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
