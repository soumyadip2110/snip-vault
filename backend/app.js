import express from 'express';

const app = express();

// Register middlewares
app.use(express.json());

// Routes import
import healthRouter from './src/routes/healthRoutes.js';

// Register routes
app.use('/api', healthRouter);


// app.get('/', (req, res) => {
//     res.send('Hello World')
// })

// app.get('/api/home', (req, res) => {
//     res.send('hello from server!');
// })

// app.post('/api/login', (req, res) => {
//     const { email, password } = req.body
//     console.log(email, '-', password)
//     res.status(200).json({
//         message: 'all ok'
//     })
// })

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


export default app;