const Appointment = require('../models/Appointment');
const DoctorNotification = require('../models/doctorNotification');
const PatientNotification = require('../models/patientNotification');
const Doctor = require('../models/doctor')

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, timeSlot, description } = req.body;

    // Check if the time slot is already booked
    const appointmentExists = await Appointment.findOne({
      doctorId,
      date,
      timeSlot
    });

    if (appointmentExists) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      date,
      timeSlot,
      description,
      status: 'scheduled'
    });
    await newAppointment.save();
    const doctorNotification = new DoctorNotification({
      doctorId,
      message: `New appointment scheduled on ${date} at ${timeSlot}.`
    });
    await doctorNotification.save();

    // Create notification for patient
    const patientNotification = new PatientNotification({
      patientId,
      message: `Your appointment with doctor ${doctorId} is confirmed on ${date} at ${timeSlot}.`
    });
    await patientNotification.save();
    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment: newAppointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    // Get doctor details and available time slots for the given day
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const availableSlots = doctor.availableTimeSlots.find(slot => slot.day === dayOfWeek);

    // Check booked slots on the same date
    const bookedAppointments = await Appointment.find({ doctorId, date });
    const bookedSlots = bookedAppointments.map(app => app.timeSlot);

    // Filter available slots
    const openSlots = availableSlots.slots.filter(slot => !bookedSlots.includes(slot));

    res.json({ availableSlots: openSlots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};