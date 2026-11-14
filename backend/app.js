import express from 'express';
import errorMiddleware from './src/middleware/error.middleware.js';

const app = express();

// Register middlewares
app.use(express.json());

// Routes import
import healthRouter from './src/routes/healthRoutes.js';

// Register routes
app.use('/api', healthRouter);


// Global error-handling middleware (must be registered after all routes)
app.use(errorMiddleware);

export default app;