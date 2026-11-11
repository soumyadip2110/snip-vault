import dotenv from 'dotenv'
import express from 'express'

dotenv.config();

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/api/home', (req, res) => {
    res.send('hello from server!');
})

app.post('/api/login', (req, res) => {
    const { email, password } = req.body
    console.log(email, '-', password)
    res.status(200).json({
        message: 'all ok'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})
