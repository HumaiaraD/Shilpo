import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
  return (
    <>
      <main className='flex md:justify-between '>
        <div className="font-lavishly text-5xl py-5 px-3">
          <span className="logo-color">Shilpo</span>
          <span className="ml-2 text-gray-400 text-sm">/she-eel-po</span>
        </div>

        <div className='flex md:flex-row  flex-col w-[70%] text-[14px] md:text-[18px] justify-between p-5 mt-5  font-lavishly font-light '>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/artwork">Artwork</NavLink>
          {/* <NavLink to="/admin">Admin</NavLink> */}
          <NavLink to="/user">My Account</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
      </main>
      
    </>
  )
}

export default Navbar