import React from 'react'
import { Outlet } from 'react-router-dom'
import DoctorNavbar from '../../components/DoctorNavbar'
const LayoutDoctor = () => {
  return (
    <div>
      <DoctorNavbar />
      <div>
        <Outlet />
      </div>
      
    </div>
  )
}

export default LayoutDoctor
