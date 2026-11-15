import express from 'express';
import errorMiddleware from './src/middleware/error.middleware.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthRouter from './src/routes/healthRoutes.js';
import authRouter from './src/routes/auth.routes.js';

const app = express();

// Register middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Register routes
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);


// Global error-handling middleware (must be registered after all routes)
app.use(errorMiddleware);

export default app;