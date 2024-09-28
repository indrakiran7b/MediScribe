import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User,  Briefcase } from 'lucide-react';
import { isBefore, startOfDay } from "date-fns";

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const AppointmentBookingPage = () => {
  

  
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [description, setDescription] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  

  
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      console.log(doctorId)
      try {
        const response = await axios.get(`http://localhost:5000/api/appointments/${doctorId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log(response);
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorInfo();
  }, [doctorId]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBook = () => {
    if (selectedDate && selectedTime && description) {
      // Here you would typically make an API call to book the appointment
      setBookingStatus('success');
    } else {
      setBookingStatus('error');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!doctor) {
    return <div className="flex justify-center items-center h-screen">Doctor not found</div>;
  }
  const today = startOfDay(new Date());
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={doctor.photoPath} alt={`${doctor.firstName} ${doctor.lastName}`} />
              <AvatarFallback>{`${doctor.firstName[0]}${doctor.lastName[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{`Dr. ${doctor.firstName} ${doctor.lastName}`}</h2>
              <p className="text-gray-500">{doctor.specialization}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Briefcase className="mr-2" />
              <span>{doctor.experience} years experience</span>
            </div>
            <div className="flex items-center">
              <User className="mr-2" />
              <span>{doctor.available ? 'Available' : 'Not Available'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => isBefore(date, today)} // Disable dates before today
            className="rounded-md border flex justify-center items-center"
          />
        </div>
        <div className="md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>Select a time slot and provide your details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="Describe your reason for visit"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleBook} className="w-full">
                Book Appointment
              </Button>
            </CardContent>
            <CardFooter>
              {bookingStatus === 'success' && (
                <Alert variant="default">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your appointment was booked successfully.</AlertDescription>
                </Alert>
              )}
              {bookingStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Please fill in all required information.</AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
















// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { format, parse, isAfter } from 'date-fns';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Calendar } from '@/components/ui/calendar';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { User, Briefcase, Clock } from 'lucide-react';
// import { Toast as toast } from '@/components/ui/toast';

// export default function AppointmentBookingPage() {
//   const { doctorId } = useParams();
//   const [doctor, setDoctor] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDoctorDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/appointments/${doctorId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setDoctor(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching doctor details:', err);
//         setError('Failed to fetch doctor details');
//         setLoading(false);
//       }
//     };

//     fetchDoctorDetails();
//   }, [doctorId]);

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setSelectedTimeSlot('');
//   };

//   const handleTimeSlotSelect = (slot) => {
//     setSelectedTimeSlot(slot);
//   };

//   const handleBookAppointment = async () => {
//     if (!selectedDate || !selectedTimeSlot || !description) {
//       toast({
//         title: "Booking Failed",
//         description: "Please fill in all fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/appointments/book', {
//         doctorId,
//         date: format(selectedDate, 'yyyy-MM-dd'),
//         timeSlot: selectedTimeSlot,
//         description
//       }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       toast({
//         title: "Appointment Booked",
//         description: "Your appointment has been successfully booked.",
//       });

//       // Reset form
//       setSelectedTimeSlot('');
//       setDescription('');
//     } catch (err) {
//       console.error('Error booking appointment:', err);
//       toast({
//         title: "Booking Failed",
//         description: "There was an error booking your appointment. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const getAvailableTimeSlots = () => {
//     if (!doctor || !doctor.availableTimeSlots) return [];

//     const dayOfWeek = format(selectedDate, 'EEEE');
//     const availableDay = doctor.availableTimeSlots.find(day => day.day === dayOfWeek);

//     if (!availableDay) return [];

//     return availableDay.slots.filter(slot => {
//       const slotTime = parse(slot, 'HH:mm', new Date());
//       return isAfter(slotTime, new Date());
//     });
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
//   }

//   if (!doctor) {
//     return <div className="flex justify-center items-center h-screen">Doctor not found</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-4">
//             <Avatar className="w-16 h-16">
//               <AvatarImage src={doctor.photoPath} alt={`${doctor.firstName} ${doctor.lastName}`} />
//               <AvatarFallback>{`${doctor.firstName[0]}${doctor.lastName[0]}`}</AvatarFallback>
//             </Avatar>
//             <div>
//               <h2 className="text-2xl font-bold">{`Dr. ${doctor.firstName} ${doctor.lastName}`}</h2>
//               <p className="text-gray-500">{doctor.specialization}</p>
//             </div>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex items-center">
//               <Briefcase className="mr-2" />
//               <span>{doctor.experience} years experience</span>
//             </div>
//             <div className="flex items-center">
//               <User className="mr-2" />
//               <span>{doctor.available ? 'Available' : 'Not Available'}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Select Date</h2>
//           <Calendar
//             mode="single"
//             selected={selectedDate}
//             onSelect={handleDateChange}
//             className="rounded-md border"
//           />
//         </div>

//         <div>
//           <h2 className="text-2xl font-bold mb-4">Select Time</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//             {getAvailableTimeSlots().map((slot) => (
//               <Button
//                 key={slot}
//                 onClick={() => handleTimeSlotSelect(slot)}
//                 variant={selectedTimeSlot === slot ? "default" : "outline"}
//               >
//                 {slot}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
//         <Textarea
//           placeholder="Describe your reason for visit"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="mb-4"
//         />
//         <Button onClick={handleBookAppointment} className="w-full">
//           Book Appointment
//         </Button>
//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { format, parse, isAfter } from 'date-fns';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Calendar } from '@/components/ui/calendar';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { User, Briefcase, Clock } from 'lucide-react';
// import { Toast as toast } from '@/components/ui/toast';

// export default function Appointment() {
//   const { doctorId } = useParams();
//   const [doctor, setDoctor] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDoctorDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/appointments/${doctorId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setDoctor(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching doctor details:', err);
//         setError('Failed to fetch doctor details');
//         setLoading(false);
//       }
//     };

//     fetchDoctorDetails();
//   }, [doctorId]);

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setSelectedTimeSlot('');
//   };

//   const handleTimeSlotSelect = (slot) => {
//     setSelectedTimeSlot(slot);
//   };

//   const handleBookAppointment = async () => {
//     if (!selectedDate || !selectedTimeSlot || !description) {
//       toast({
//         title: "Booking Failed",
//         description: "Please fill in all fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/appointments/book', {
//         doctorId,
//         date: format(selectedDate, 'yyyy-MM-dd'),
//         timeSlot: selectedTimeSlot,
//         description
//       }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       toast({
//         title: "Appointment Booked",
//         description: "Your appointment has been successfully booked.",
//       });

//       // Reset form
//       setSelectedTimeSlot('');
//       setDescription('');
//     } catch (err) {
//       console.error('Error booking appointment:', err);
//       toast({
//         title: "Booking Failed",
//         description: "There was an error booking your appointment. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const getAvailableTimeSlots = () => {
//     if (!doctor || !doctor.availableTimeSlots) return [];

//     const dayOfWeek = format(selectedDate, 'EEEE');
//     const availableDay = doctor.availableTimeSlots.find(day => day.day === dayOfWeek);

//     if (!availableDay) return [];

//     return availableDay.slots.filter(slot => {
//       const slotTime = parse(slot, 'HH:mm', new Date());
//       return isAfter(slotTime, new Date());
//     });
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
//   }

//   if (!doctor) {
//     return <div className="flex justify-center items-center h-screen">Doctor not found</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-4">
//             <Avatar className="w-16 h-16">
//               <AvatarImage src={doctor.photoPath} alt={`${doctor.firstName} ${doctor.lastName}`} />
//               <AvatarFallback>{`${doctor.firstName[0]}${doctor.lastName[0]}`}</AvatarFallback>
//             </Avatar>
//             <div>
//               <h2 className="text-2xl font-bold">{`Dr. ${doctor.firstName} ${doctor.lastName}`}</h2>
//               <p className="text-gray-500">{doctor.specialization}</p>
//             </div>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex items-center">
//               <Briefcase className="mr-2" />
//               <span>{doctor.experience} years experience</span>
//             </div>
//             <div className="flex items-center">
//               <User className="mr-2" />
//               <span>{doctor.available ? 'Available' : 'Not Available'}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Select Date</h2>
//           <Calendar
//             mode="single"
//             selected={selectedDate}
//             onSelect={handleDateChange}
//             className="rounded-md border"
//           />
//         </div>

//         <div>
//           <h2 className="text-2xl font-bold mb-4">Select Time</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//             {getAvailableTimeSlots().map((slot) => (
//               <Button
//                 key={slot}
//                 onClick={() => handleTimeSlotSelect(slot)}
//                 variant={selectedTimeSlot === slot ? "default" : "outline"}
//               >
//                 {slot}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
//         <Textarea
//           placeholder="Describe your reason for visit"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="mb-4"
//         />
//         <Button onClick={handleBookAppointment} className="w-full">
//           Book Appointment
//         </Button>
//       </div>
//     </div>
//   );
// }