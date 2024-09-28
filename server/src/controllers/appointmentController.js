const Appointment = require('../models/Appointment');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, description } = req.body;
    const patientId = req.user.id; // Assuming the patient ID is stored in the token

    const availableSlots = await this.getAvailableTimeSlots({ query: { doctorId, date } }, { json: jest.fn() });
    if (!availableSlots.availableTimeSlots.includes(timeSlot)) {
      return res.status(400).json({ message: 'This slot is not available. Please choose another time.' });
    }

    
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      date,
      timeSlot,
      description
    });

    await newAppointment.save();

    console.log('Appointment was successfull')

    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId }).populate('patientId', 'name email');
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};