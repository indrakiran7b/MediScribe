import React, { useState } from 'react'
import {assets} from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import AccountMenu from './AccountMenu'
const Navbar = () => {
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false)
    const [token, setToken] = useState(false)
    const handleMenu = () => setShowMenu(!showMenu)
  return (
    <div className='relative'>

    <div className='flex items-center justify-between text-sm py-2 mb-5 '>
      <img className='w-44 cursor-pointer' src={assets.logo1} alt=""/>
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
            <li className='py-1'>Home</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>    
        </NavLink>
        <NavLink to='/doctors'>
            <li className='py-1'>Doctors</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>    
        </NavLink>
        <NavLink to='/medical-history'>
            <li className='py-1'>History</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
        <NavLink to='/contact'>
            <li className='py-1'>Contact</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>    
        </NavLink>
        <NavLink to='/about'>
            <li className='py-1'>About Us</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>    
        </NavLink>
      </ul>
      <div className='flex items-center gap-4 '>
        {
            token? <div className='flex gap-2 cursor-pointer items-center relative group'>
               
                <div className=''>
                    <AccountMenu setToken={setToken}/>
                    
                    
                </div>
            </div> : <button onClick={()=>navigate('/auth')}  className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
        }
        
      </div>
    </div>
            
    </div>
  )
}

export default Navbar
