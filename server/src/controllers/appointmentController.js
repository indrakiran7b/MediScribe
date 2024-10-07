const Appointment = require('../models/appointment');
const DoctorNotification = require('../models/doctorNotification');
const PatientNotification = require('../models/patientNotification');
const Doctor = require('../models/doctor')

exports.bookAppointment = async (req, res) => {
  try {
    console.log("hello", req.body)
    const { doctorId, patientId, date, timeSlot, description } = req.body;
    // if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(patientId)) {
    //   return res.status(400).json({ error: 'Invalid doctor or patient ID.' });
    // }
    console.log(doctorId, patientId, date, timeSlot, description)
    // Check if the time slot is already booked
    // const appointmentExists = await Appointment.findOne({ date:date, timeSlot:timeSlot });
    const count = await Appointment.countDocuments();
    console.log(count);
    if (count > 0) {
      console.log('hi');
      const appointmentExists = await Appointment.findOne({ doctorId, date, timeSlot });
      console.log('Appointment already exists', appointmentExists)

    if (appointmentExists) {
      console.log(`Appointment1`)
      console.log('Appointment')
      return res.status(200).json({ message: 'This time slot is already booked.' });
      console.log('nvjf');
    }

    
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
    console.log("completed1");
    created_date = Date.now();
    console.log("completed2");
    const doctorNotification = new DoctorNotification({
      doctorId:doctorId,
      message: `New appointment scheduled on ${date} at ${timeSlot} description .`,
      BookedAt: created_date

    });
    console.log(doctorNotification);
    await doctorNotification.save();

    console.log("completed");

    // Create notification for patient
    const patientNotification = new PatientNotification({
      patientId,
      message: `Your appointment with doctor ${doctorId} is confirmed on ${date} at ${timeSlot}.`,
      BookedAt: created_date
    });
    await patientNotification.save();
    console.log()
    res.status(201).json({
      message: 'Appointment booked successfully!'
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