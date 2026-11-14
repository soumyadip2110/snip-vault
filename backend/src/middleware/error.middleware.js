import ApiResponse from '../utils/ApiResponse.js';

const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    // 1. Handle operational errors
    if (err.isOperational === true) {
        return res.status(err.statusCode).json(
            new ApiResponse(err.statusCode, null, err.message)
        );
    }

    // 2. Log unexpected errors safely
    console.error('UNEXPECTED ERROR:', {
        name: err.name,
        message: err.message,
        path: req.originalUrl,
        method: req.method
    });

    // 3. Hide internal error details
    return res.status(500).json(
        new ApiResponse(500, null, 'Internal Server Error')
    );
};

export default errorMiddleware;
