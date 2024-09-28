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
import { format, addDays, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Toast as toast } from '@/components/ui/toast';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
];

const doctorDetails = {
  name: "Dr. Jane Smith",
  specialty: "Cardiology",
  experience: "15 years",
  rating: 4.8
};

export default function AppointmentBookingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [description, setDescription] = useState('');
  const [bookedSlots, setBookedSlots] = useState({});

  useEffect(() => {
    // Simulating fetching booked slots from an API
    const fetchBookedSlots = async () => {
      // In a real application, this would be an API call
      const mockBookedSlots = {
        [format(new Date(), 'yyyy-MM-dd')]: ['10:00', '14:00'],
        [format(addDays(new Date(), 1), 'yyyy-MM-dd')]: ['11:00', '15:00'],
      };
      setBookedSlots(mockBookedSlots);
    };
    fetchBookedSlots();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot('');
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTimeSlot || !description) {
      toast({
        title: "Booking Failed",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to book the appointment
    console.log('Booking appointment:', {
      date: format(selectedDate, 'yyyy-MM-dd'),
      timeSlot: selectedTimeSlot,
      description
    });

    toast({
      title: "Appointment Booked",
      description: "Your appointment has been successfully booked.",
    });

    // Reset form
    setSelectedTimeSlot('');
    setDescription('');
  };

  const isSlotBooked = (date, slot) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookedSlots[dateStr] && bookedSlots[dateStr].includes(slot);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{doctorDetails.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Specialty: {doctorDetails.specialty}</p>
          <p>Experience: {doctorDetails.experience}</p>
          <p>Rating: {doctorDetails.rating}/5</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Date</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            fromDate={new Date()}
            toDate={addDays(new Date(), 29)}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Select Time</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                onClick={() => handleTimeSlotSelect(slot)}
                disabled={isSlotBooked(selectedDate, slot)}
                variant={selectedTimeSlot === slot ? "default" : "outline"}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
        <Textarea
          placeholder="Describe your reason for visit"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleBookAppointment} className="w-full">
          Book Appointment
        </Button>
      </div>
    </div>
  );
}