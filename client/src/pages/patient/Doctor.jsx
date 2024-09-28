import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {useAuth} from '../../context/AuthContext'

const Doctor = () => {
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);  // New loading state
  const navigate = useNavigate();
  const {checkAuthStatus} = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    } else {
      // await checkAuthStatus();
      fetchSpecialties();
    }
  }, [navigate]);

  

  useEffect(() => {
    if (selectedSpecialty) {
      fetchDoctors(selectedSpecialty);
    }
  }, [selectedSpecialty]);

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/specialties', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSpecialties(response.data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      if (error.response && error.response.status === 401) {
        navigate('/auth');
      }
    }
  };

  const fetchDoctors = async (specialtyId) => {
    setLoading(true);  // Show loading state
    try {
      const response = await axios.get(`http://localhost:5000/api/doctors/specialty/${specialtyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
    finally {
      setLoading(false);  // Hide loading state
    }
  };
  const handleAppointment= (doctor)=>{
    navigate(`/appointments/${doctor._id}`)
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>
      <Select onValueChange={setSelectedSpecialty}>
        <SelectTrigger className="w-[280px] mb-4">
          <SelectValue placeholder="Select a specialty" />
        </SelectTrigger>
        <SelectContent>
          {specialties.map((specialty) => (
            <SelectItem key={specialty._id} value={specialty._id}>
              {specialty.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <Card key={doctor._id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={doctor.photoPath} alt={`${doctor.user.firstName} ${doctor.user.lastName}`} />
                  <AvatarFallback>{`${doctor.user.firstName[0]}${doctor.user.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <span>{`${doctor.user.firstName} ${doctor.user.lastName}`}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Specialty:</strong> {specialties.find((spec) => spec._id === doctor.specialty).name}</p>
              <p><strong>Experience:</strong> {doctor.experience} years</p>
              <p><strong>Status:</strong> {doctor.available ? 'Available' : 'Not Available'}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={()=>handleAppointment(doctor)} disabled={!doctor.available}>
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