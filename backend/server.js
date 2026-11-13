import dotenv from 'dotenv';
import connectDb from './src/config/db.js';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('Failed to start server: ', error.message);
        process.exit(1);
    }
};

startServer();
