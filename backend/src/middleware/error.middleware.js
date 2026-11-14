import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const errorMiddleware = (err, req, res, next) => {
    // 1. Handle errors when response headers are already sent
    if (res.headersSent) {
        return next(err);
    }

    // 2. Convert MongoDB duplicate-key errors
    if (err.code === 11000) {
        err = new ApiError(409, 'Resource already exists!');
    }

    // 3. Convert Mongoose validation errors
    else if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(
            error => error.message
        );

        err = new ApiError(
            400,
            validationErrors.join(', '),
            validationErrors
        );
    }

    // 4. Convert invalid MongoDB ObjectId errors
    else if (err.name === 'CastError') {
        err = new ApiError(400, 'Invalid resource identifier!');
    }

    // 5. Handle operational errors
    if (err.isOperational === true) {
        return res.status(err.statusCode).json(
            new ApiResponse(
                err.statusCode,
                null,
                err.message,
                err.errors || []
            )
        );
    }

    // 6. Log unexpected errors
    console.error('UNEXPECTED ERROR:', {
        name: err.name || 'Unknown Error',
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString(),
        stack: err.stack
    });

    // 7. Return a generic response for unexpected errors
    return res.status(500).json(
        new ApiResponse(
            500,
            null,
            'Internal Server Error'
        )
    );
};

export default errorMiddleware;
