import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
	const [msg, setMsg] = useState('no msg')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	useEffect(() => {
		axios.get('/api/home')
			.then(response => {
				setMsg(response.data)
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	const handleLogin = () => {
		if (email && password) {
			axios.post('/api/login', {
				'email': email,
				'password': password
			})
				.then(response => {
					setMsg(response.data.message)
				})
		}
	}

	return (
		<>
			<h1>{msg}</h1>
			<label>Email:</label>
			<input
				type='text'
				value={email}
				onChange={e => setEmail(e.target.value)}
			/>
			<label>Password:</label>
			<input
				type='password'
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<button onClick={handleLogin}>
				Login
			</button>
		</>
	)
}

export default App
