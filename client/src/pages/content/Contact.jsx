import React, { useState } from 'react';
import axios from 'axios';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { assets } from '../../assets/assets_frontend/assets';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/feedback', formData);
      setIsSubmitting(false);
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        message: '',
      });
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setIsSubmitting(false);
      setShowErrorAlert(true);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row max-w-6xl mx-auto py-12">
      <div className="md:w-1/2 flex items-center justify-center">
        <img
          src={assets.bussiness3d1}
          alt="Man standing"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
      <div className="md:w-1/2 px-4">
        <h1 className="text-2xl font-bold mb-4">Get in Touch</h1>
        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <h3>First Name</h3>
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
          <h3>Last Name</h3>
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
          <h3>Phone Number</h3>
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
          <h3>Email</h3>
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
          <h3>Message</h3>
            <Textarea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </form>

        {showSuccessAlert && (
          <Alert variant="success" className="mt-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your feedback has been submitted successfully.</AlertDescription>
          </Alert>
        )}

        {showErrorAlert && (
          <Alert variant="error" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error submitting your feedback. Please try again later.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Contact;