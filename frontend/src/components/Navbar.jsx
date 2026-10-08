import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
  return (
    <>
      <div className='flex justify-between p-5 font-lavishly font-light'>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/artwork">Artwork</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
    </>
  )
}

export default Navbar