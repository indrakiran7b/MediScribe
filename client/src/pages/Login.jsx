import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User, UserPlus, Stethoscope, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import {useAuth} from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@material-tailwind/react';


const Login = () => {

  const navigate = useNavigate();
  const { login, signup, googleSignIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: { day: '', month: '', year: '' },
    gender: '',
    phoneNumber: '',
    emrSystem: ''
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google Sign-In Successful:', credentialResponse);
    try {
      const response = await googleSignIn(credentialResponse.credential);
      console.log('Google Sign-In response:', response);
      
      // Handle successful sign-in
      // This might include updating UI, redirecting, etc.
      navigate('/home'); // or wherever you want to redirect after successful login
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      console.error('Error details:', error.response?.data);
      // Handle the error, maybe show a notification to the user
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In Failed');
    // Handle the error, maybe show a notification to the user
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDobChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      dob: { ...prev.dob, [type]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = getEndpoint();
    try {
      let response;
      if (isSignUp) {
        response = await signup(formData);
      } else {
        response = await login(formData);
      }
      
      if (response.success) {
        switch (role) {
          case 'patient':
            navigate('/home');
            break;
          case 'doctor':
            navigate('/doctor-page');
            break;
          case 'admin':
            navigate('/admin-page');
            break;
          default:
            navigate('/');
        }
      } else {
        console.error('Authentication error:', error);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle error (e.g., show error message)
    }
  };

  const getEndpoint = () => {
    switch (role) {
      case 'patient':
        return isSignUp ? '/api/patient/signup' : '/api/patient/signin';
      case 'doctor':
        return '/api/doctor/signin';
      case 'admin':
        return '/api/admin/signin';
      default:
        return '/api/signin';
    }
  };
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole !== 'patient') {
      setIsSignUp(false);
    }
  };
  const getWelcomeMessage = () => {
    
    switch (role) {
      case 'patient':
        if (isSignUp) return "Welcome, New User!";
        return "Welcome Back, Patient!";
      case 'doctor':
        return "Welcome, Doctor!";
      case 'admin':
        return "Welcome, Admin!";
      default:
        return "Welcome!";
    }
  };

  return (
    <div className='mt-20 flex gap-3 items-center justify-center min-h-screen  from-blue-100 to-indigo-100'>
      
      <Card className="w-[500px] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
          <CardTitle className="text-2xl font-bold text-center">{getWelcomeMessage()}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                type="button"
                variant={role === 'patient' ? 'default' : 'outline'}
                className={`flex-1 ${role === 'patient' ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
                onClick={() => handleRoleChange('patient')}
              >
                <User className="mr-2 h-4 w-4" />
                Patient
              </Button>
              <Button
                type="button"
                variant={role === 'doctor' ? 'default' : 'outline'}
                className={`flex-1 ${role === 'doctor' ? 'bg-green-500 text-white' : 'text-green-500'}`}
                onClick={() => handleRoleChange('doctor')}
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                Doctor
              </Button>
              <Button
                type="button"
                variant={role === 'admin' ? 'default' : 'outline'}
                className={`flex-1 ${role === 'admin' ? 'bg-purple-500 text-white' : 'text-purple-500'}`}
                onClick={() => handleRoleChange('admin')}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            {isSignUp && role === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="As per Aadhar"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="As per Aadhar"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="DD"
                      value={formData.dob.day}
                      onChange={(e) => handleDobChange('day', e.target.value)}
                      required
                    />
                    <Input
                      placeholder="MM"
                      value={formData.dob.month}
                      onChange={(e) => handleDobChange('month', e.target.value)}
                      required
                    />
                    <Input
                      placeholder="YYYY"
                      value={formData.dob.year}
                      onChange={(e) => handleDobChange('year', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emrSystem">EMR System</Label>
                  <Select name="emrSystem" onValueChange={(value) => setFormData(prev => ({ ...prev, emrSystem: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select EMR system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system1">System 1</SelectItem>
                      <SelectItem value="system2">System 2</SelectItem>
                      <SelectItem value="system3">System 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 bg-gray-50 p-0">
        {role === 'patient' && !isSignUp && (
            <>
              
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="100%"
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
              />
              <p className="text-sm text-slate-600 text-center">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Button>
              </p>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;