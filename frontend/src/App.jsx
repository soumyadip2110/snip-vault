import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
	const [msg, setMsg] = useState('no msg')
	useEffect(() => {
		axios.get('/api/home')
			.then(response => {
				setMsg(response.data)
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	return (
		<h1>{msg}</h1>
	)
}

export default App
