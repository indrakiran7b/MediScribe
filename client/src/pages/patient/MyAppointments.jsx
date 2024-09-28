import React from 'react'

export default function MyAppointments() {
  return (
    <div>
      Appointments
    </div>
  )
}
// import React, { useState } from "react";
// import { FaCalendarAlt, FaUserMd, FaGraduationCap, FaBriefcase } from "react-icons/fa";
// import { MdAccessTime } from "react-icons/md";

// const DoctorCard = ({ doctor, onBookAppointment }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleBookAppointment = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       onBookAppointment(doctor);
//       setIsLoading(false);
//     }, 2000);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500"
//          tabIndex="0"
//          aria-label={`Doctor ${doctor.name} card`}>
//       <img src={doctor.photo} alt={doctor.name} className="w-full h-48 object-cover" />
//       <div className="p-4">
//         <h2 className="text-xl font-semibold mb-2">{doctor.name}</h2>
//         <p className="text-gray-600 mb-2"><FaUserMd className="inline mr-2" />{doctor.specialty}</p>
//         <p className="text-gray-600 mb-2"><MdAccessTime className="inline mr-2" />{doctor.availability}</p>
//         <p className="text-gray-600 mb-2"><FaGraduationCap className="inline mr-2" />{doctor.study}</p>
//         <p className="text-gray-600 mb-2"><FaBriefcase className="inline mr-2" />{doctor.experience}</p>
//         <p className="text-gray-700 mb-4">{doctor.description}</p>
//         <button
//           onClick={handleBookAppointment}
//           disabled={isLoading}
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
//           aria-label={`Book appointment with Dr. ${doctor.name}`}
//         >
//           {isLoading ? (
//             <span className="flex items-center justify-center">
//               <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing
//             </span>
//           ) : (
//             <span className="flex items-center justify-center">
//               <FaCalendarAlt className="mr-2" /> Book Appointment
//             </span>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// const SelectDoctorSpecialties = () => {
//   const [doctors] = useState([
//     {
//       id: 1,
//       name: "Dr. Emily Johnson",
//       specialty: "Cardiologist",
//       availability: "Mon-Fri, 9AM-5PM",
//       photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       description: "Experienced cardiologist specializing in heart health and preventive care.",
//       study: "MD, Harvard Medical School",
//       experience: "15 years"
//     },
//     {
//       id: 2,
//       name: "Dr. Michael Chen",
//       specialty: "Pediatrician",
//       availability: "Tue-Sat, 10AM-6PM",
//       photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       description: "Caring pediatrician dedicated to children's health and development.",
//       study: "MD, Johns Hopkins University",
//       experience: "10 years"
//     },
//     {
//       id: 3,
//       name: "Dr. Sarah Martinez",
//       specialty: "Dermatologist",
//       availability: "Mon-Thu, 8AM-4PM",
//       photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
//       description: "Expert dermatologist focusing on skin health and cosmetic procedures.",
//       study: "MD, Stanford University",
//       experience: "12 years"
//     }
//   ]);

//   const handleBookAppointment = (doctor) => {
//     console.log(`Appointment booked with ${doctor.name}`);
//     // Implement your appointment booking logic here
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Select Doctor Specialties</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {doctors.map((doctor) => (
//           <DoctorCard key={doctor.id} doctor={doctor} onBookAppointment={handleBookAppointment} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SelectDoctorSpecialties;