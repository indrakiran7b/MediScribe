import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {assets} from '../assets/assets_frontend/assets'

const specialties = [
  "Dermatology",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "Ophthalmology",
  "Psychiatry",
  "Oncology",
  "Endocrinology"
];

const doctors = [
  { id: 1, name: "Dr. John Doe", specialty: "Dermatology", photo: "/api/placeholder/100/100", available: true, experience: 10 },
  { id: 2, name: "Dr. Jane Smith", specialty: "Cardiology", photo: "/api/placeholder/100/100", available: false, experience: 15 },
  { id: 3, name: "Dr. Mike Johnson", specialty: "Neurology", photo: "/api/placeholder/100/100", available: true, experience: 8 },
  { id: 4, name: "Dr. Sarah Brown", specialty: "Pediatrics", photo: "/api/placeholder/100/100", available: true, experience: 12 },
  { id: 5, name: "Dr. Emily Davis", specialty: "Orthopedics", photo: "/api/placeholder/100/100", available: false, experience: 20 },
  // Add more doctors as needed
];

const Doctor = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const filteredDoctors = selectedSpecialty
    ? doctors.filter(doctor => doctor.specialty === selectedSpecialty)
    : doctors;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>
      <Select onValueChange={setSelectedSpecialty}>
        <SelectTrigger className="w-[280px] mb-4">
          <SelectValue placeholder="Select a specialty" />
        </SelectTrigger>
        <SelectContent>
          {specialties.map((specialty) => (
            <SelectItem key={specialty} value={specialty}>
              {specialty}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={assets.doctor1} alt={doctor.name} />
                  <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span>{doctor.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Specialty:</strong> {doctor.specialty}</p>
              <p><strong>Experience:</strong> {doctor.experience} years</p>
              <p><strong>Status:</strong> {doctor.available ? 'Available' : 'Not Available'}</p>
            </CardContent>
            <CardFooter>
              <Button disabled={!doctor.available}>
                {doctor.available ? 'Book Appointment' : 'Not Available'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctor;