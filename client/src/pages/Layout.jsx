import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
const Home = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
      
    </div>
  )
}

export default Home
