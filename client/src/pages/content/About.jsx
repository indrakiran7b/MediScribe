// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import axios from 'axios';

// const OTPVerification = () => {
//   const [otp, setOtp] = useState('');
//   const [timeLeft, setTimeLeft] = useState(60); // 5 minutes in seconds
//   const [error, setError] = useState('');
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email;

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timerId);
//     }
//   }, [timeLeft]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await axios.post('/api/verify-otp', { email, otp });
//       navigate('/dashboard');
//     } catch (error) {
//       setError(error.response?.data?.message || 'Invalid OTP');
//     }
//   };

//   const handleResend = async () => {
//     setError('');
//     try {
//       await axios.post('/api/resend-otp', { email });
//       setTimeLeft(60);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Error resending OTP');
//     }
//   };

//   return (
//     <div className='flex justify-center items-center mt-20'>
//     <Card className="w-[500px]">
//       <CardHeader>
//         <CardTitle>Verify OTP</CardTitle>
//         <CardDescription>Enter the OTP sent to {email}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="otp">OTP</Label>
//             <Input
//               id="otp"
//               name="otp"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter 6-digit OTP"
//               required
//             />
//           </div>
//           <p>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
//           {error && <p className="text-red-500">{error}</p>}
//           <p>Check your email for OTP</p>
//         </form>
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button onClick={handleResend} disabled={timeLeft > 0}>Resend OTP</Button>
//         <Button onClick={handleSubmit}>Verify</Button>
//       </CardFooter>
//     </Card>
//     </div>
//   );
// };

// export default OTPVerification;





import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, User, Book, X, Play } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    totalPatients: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Replace these URLs with your actual backend endpoints
      const [statsResponse, appointmentsResponse] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/appointments')
      ]);

      setStats(statsResponse.data);
      setAppointments(appointmentsResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Handle error appropriately - maybe show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAppointment = (appointmentId) => {
    navigate(`/appointment/${appointmentId}`);
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.post(`/api/appointments/${appointmentId}/cancel`);
      // Refresh appointments after cancellation
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
      // Maybe show a success toast
    } catch (error) {
      console.error("Error canceling appointment:", error);
      // Handle error - show error toast
    }
  };

  const StatCard = ({ icon: Icon, value, label }) => (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="rounded-full bg-blue-100 p-3 mr-4">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">{value}</CardTitle>
          <p className="text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );

  const AppointmentList = () => (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Book className="h-5 w-5 mr-2 text-blue-500" />
          Latest Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={appointment.patientPhoto} 
                    alt={appointment.patientName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{appointment.patientName}</h3>
                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                    <p className="text-sm text-gray-600 mt-1">{appointment.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleStartAppointment(appointment.id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Play className="h-4 w-4 mr-1" /> Start
                  </Button>
                  <Button 
                    onClick={() => handleCancelAppointment(appointment.id)}
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div>Loading...</div>; // Consider using a proper loading spinner
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={User} value={stats.totalDoctors} label="Doctors" />
        <StatCard icon={CalendarIcon} value={stats.totalAppointments} label="Appointments" />
        <StatCard icon={User} value={stats.totalPatients} label="Patients" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AppointmentList />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;