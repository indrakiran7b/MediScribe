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
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import LayoutDoctor from './pages/content/LayoutDoctor';
import DoctorPatientPage from './pages/doctor/DoctorPatientPage';

function AppContent() {
  console.log('hvkudfbvdfj')
  const user = localStorage.getItem('user');
  console.log('app.jsx',user)
  return (
   
      
        <div className='mx-4 sm:mx-[10%]'>
          <Routes>
            <Route path='/auth' element={<Login />} />
              {/* Conditional rendering based on user type */}
            {user === 'doctor'? (
              <Route path="/" element={<LayoutDoctor />}>
                
                <Route path='/doctor-page' element={<DoctorDashboard />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/about' element={<About />} />
                <Route path='/doctor-page/appointments' element={<DoctorAppointmentsPage />} />
                <Route path='/doctor-page/appointments/:appointmentId' element={<DoctorPatientPage />} />
              </Route>
            )
            :
            <></>}


       
            {user === 'patient'? (
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/doctors' element={<Doctor />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/medical-history' element={<MedicalHistory />} />
                <Route path='/doctors/:speciality' element={<Doctor />} />
                <Route path='/my-profile' element={<MyProfile />} />
                <Route path='/my-appointments' element={<MyAppointments />} />
                <Route path='/appointments/:doctorId' element={<AppointmentBookingPage />} />
              </Route>
            ):
            <></>}
            <Route path='*' element={<Login />} />
          </Routes>
        </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


export default App;


{/* <Route path="/" element={<LayoutDoctor />}>
              <Route index element={<Home />} />
              <Route path='/doctor-page' element={<DoctorDashboard />}/>
              <Route path='/doctor-page/appointments' element={<DoctorAppointmentsPage />}/>
              <Route path='/doctor-page/appointments/:appointmentId' element={<DoctorPatientPage />}/>
            </Route>
            
            {/* <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/doctors' element={<Doctor />} />
              <Route path='/medical-history' element={<MedicalHistory />} />
              <Route path='/doctors/:speciality' element={<Doctor />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/my-profile' element={<MyProfile />} />
              <Route path='/my-appointments' element={<MyAppointments />} />
              <Route path='/appointments/:doctorId' element={<AppointmentBookingPage />} />
        
            // </Route> */}