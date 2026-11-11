import dotenv from 'dotenv'
import express from 'express'

dotenv.config();

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/api/home', (req, res) => {
    res.send('hello from server!');
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})
