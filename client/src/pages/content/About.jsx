// // import React, { useState, useEffect } from 'react';
// // import { useLocation, useNavigate } from 'react-router-dom';
// // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Label } from "@/components/ui/label";
// // import axios from 'axios';

// // const OTPVerification = () => {
// //   const [otp, setOtp] = useState('');
// //   const [timeLeft, setTimeLeft] = useState(60); // 5 minutes in seconds
// //   const [error, setError] = useState('');
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const email = location.state?.email;

// //   useEffect(() => {
// //     if (timeLeft > 0) {
// //       const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
// //       return () => clearTimeout(timerId);
// //     }
// //   }, [timeLeft]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     try {
// //       await axios.post('/api/verify-otp', { email, otp });
// //       navigate('/dashboard');
// //     } catch (error) {
// //       setError(error.response?.data?.message || 'Invalid OTP');
// //     }
// //   };

// //   const handleResend = async () => {
// //     setError('');
// //     try {
// //       await axios.post('/api/resend-otp', { email });
// //       setTimeLeft(60);
// //     } catch (error) {
// //       setError(error.response?.data?.message || 'Error resending OTP');
// //     }
// //   };

// //   return (
// //     <div className='flex justify-center items-center mt-20'>
// //     <Card className="w-[500px]">
// //       <CardHeader>
// //         <CardTitle>Verify OTP</CardTitle>
// //         <CardDescription>Enter the OTP sent to {email}</CardDescription>
// //       </CardHeader>
// //       <CardContent>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div className="space-y-2">
// //             <Label htmlFor="otp">OTP</Label>
// //             <Input
// //               id="otp"
// //               name="otp"
// //               value={otp}
// //               onChange={(e) => setOtp(e.target.value)}
// //               placeholder="Enter 6-digit OTP"
// //               required
// //             />
// //           </div>
// //           <p>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
// //           {error && <p className="text-red-500">{error}</p>}
// //           <p>Check your email for OTP</p>
// //         </form>
// //       </CardContent>
// //       <CardFooter className="flex justify-between">
// //         <Button onClick={handleResend} disabled={timeLeft > 0}>Resend OTP</Button>
// //         <Button onClick={handleSubmit}>Verify</Button>
// //       </CardFooter>
// //     </Card>
// //     </div>
// //   );
// // };

// // export default OTPVerification;






const DoctorDashboard = () => {
  return (
    <>
    Hi
    </>
  )
};

export default DoctorDashboard;