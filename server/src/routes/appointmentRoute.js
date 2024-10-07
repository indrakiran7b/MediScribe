const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');
const { bookAppointment, getDoctorAppointments } = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');

const mongoose = require('mongoose');

router.get('/:id', async (req, res) => {

  console.log('Received request for doctor ID:', req.params);
  console.log(req.url);
  if (!req.params.id) {
    return res.status(400).json({ message: 'Doctor ID is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-password')
      .populate('specialty', 'name');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      _id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      specialization: doctor.specialization,
      specialty: doctor.specialty,
      experience: doctor.experience,
      available: doctor.available,
      photoPath: doctor.photoPath,
      availableTimeSlots: doctor.availableTimeSlots,
      description:doctor.description,
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




router.post('/book', authenticateToken, bookAppointment);
// router.get('/:doctorId', authenticateToken, getDoctorAppointments);

module.exports = router;
