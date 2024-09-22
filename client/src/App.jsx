import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "@fontsource/manrope";
import './App.css';
import Home from './pages/Home';
import Doctor from './pages/Doctor';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import About from './pages/About';
import Appointment from './pages/Appointment';
import Layout from './pages/Layout';
import MedicalHistory from './pages/MedicalHistory';

function App() {
  return (
    <GoogleOAuthProvider clientId="623113578265-1jr8ooro6s731lqoubvbjscgeqnl2rc2.apps.googleusercontent.com">
      <div className='mx-4 sm:mx-[10%]'>
        <Routes>
          <Route path='*' element={<Login />} />
          <Route path='/auth' element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/doctors' element={<Doctor />} />
            <Route path='/medical-history' element={<MedicalHistory />} />
            <Route path='/doctors/:speciality' element={<Doctor />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/my-appointments' element={<MyAppointments />} />
            <Route path='/appointments/:docID' element={<Appointment />} />
          </Route>
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;