import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Artwork from './pages/Artwork'
import Contact from './pages/Contact'
// import Collection from './pages/Collection'
// import Artists from './pages/Artists'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='font-lavishly text-5xl'>
        Shilpo <span className='text-blue-400 text-sm'>/she-eel-po</span> 
      </div>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/artwork" element={<Artwork />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/collection" element={<Collection />} />
          <Route path="/artists" element={<Artists />} /> */}
        </Route>
      </Routes>
    </>
  )
}

export default App
