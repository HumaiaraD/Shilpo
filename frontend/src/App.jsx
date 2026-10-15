import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Artwork from './pages/Artwork'
import About from './pages/About'
import Login from './pages/Login'
import User from './pages/User'
import Signup from "./pages/Signup";



function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuhtLoading] = useState(true);
  
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("http://localhost:5555/check_session",{ credentials: "include" })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Session check failed:", error)
      } finally {
        setAuhtLoading(false)
      }
      
    }
    checkSession()
  }, [])

  
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login"  element={<Login setUser={setUser} />} />
          <Route path="/user" element={authLoading ? <p>Loading...</p> : <User user={user} setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/admin" element={<Admin user={user}/>} />
          <Route path="/artwork" element={<Artwork />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
