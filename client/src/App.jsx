import React from 'react';
import { Route, Routes } from 'react-router-dom';
import "@fontsource/manrope";
import './App.css';
import Home from './pages/content/Home';
import Doctor from './pages/patient/Doctor';
import Contact from './pages/content/Contact';
import Login from './pages/Authentication/Login';
import MyProfile from './pages/patient/MyProfile';
import MyAppointments from './pages/patient/MyAppointments';
import About from './pages/content/About';
import AppointmentBookingPage from './pages/patient/Appointment';
import Layout from './pages/content/Layout';
import MedicalHistory from './pages/patient/MedicalHistory';
import { AuthProvider } from './context/AuthContext';
import DoctorDashboard from './pages/doctor/DoctorDashboard';

function App() {
  return (
   
      <AuthProvider>
        <div className='mx-4 sm:mx-[10%]'>
          <Routes>
            <Route path='/auth' element={<Login />} />
            <Route path='/doctor-page' element={<DoctorDashboard />}/>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/doctors' element={<Doctor />} />
              <Route path='/medical-history' element={<MedicalHistory />} />
              <Route path='/doctors/:speciality' element={<Doctor />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/my-profile' element={<MyProfile />} />
              <Route path='/my-appointments' element={<MyAppointments />} />
              <Route path='/appointments/:doctorId' element={<AppointmentBookingPage />} />
              
            </Route>
            <Route path='*' element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
   
  );
}

export default App;