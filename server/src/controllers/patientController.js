const Patient = require('../models/patient'); // Assuming you have a Patient model
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const CompletedAppointment = require('../models/completedAppointmentSchema');



exports.getPatientDetails = async (req, res) => {
  try {
    const {id} = req.params;

    // Find the patient by ID
    const patient = await Patient.findById(id).select('-password');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return the patient details
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.getPatientMedicalHistory = async (req, res) => {
    try {
      const { id } = req.params; // patientId
      
      // Fetch all appointments for the given patientId
      const appointments = await Appointment.find({ patientId: id })
        .sort({ date: -1 })
        .populate('doctorId', 'firstName lastName specialization') // Populating basic doctor details
        .lean();
      
      if (!appointments.length) {
        return res.status(404).json({ message: 'No appointments found for this patient' });
      }
  
      // Extract unique doctorIds from appointments
      const uniqueDoctorIds = [...new Set(appointments.map(app => app.doctorId._id))];
  
      // Fetch the full doctor details for the unique doctorIds
      const doctors = await Doctor.find({ _id: { $in: uniqueDoctorIds } })
        .select('firstName lastName specialization')
        .lean();
      
      // Create a mapping of doctorId to doctor details
      const doctorMap = {};
      doctors.forEach(doctor => {
        doctorMap[doctor._id] = doctor;
      });
  
      // Construct the medical history array by mapping appointments with doctor details
      const medicalHistory = appointments.map(appointment => ({
        _id: appointment._id,
        firstName: `${doctorMap[appointment.doctorId._id].firstName}`, 
        lastName:`${doctorMap[appointment.doctorId._id].lastName}`,
        specialization: doctorMap[appointment.doctorId._id].specialization,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        description: appointment.description,
        status: appointment.status,
      }));
      console.log(medicalHistory);
      res.status(200).json(medicalHistory);
    } catch (error) {
      console.error('Error fetching patient medical history:', error);
      res.status(500).json({ message: 'Error fetching patient medical history', error: error.message });
    }
  };
  


// Fetch completed appointment details for the patient
exports.getCompletedAppointmentDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the completed appointment by the appointment ID
      const completedAppointment = await CompletedAppointment.findOne({ appointmentId:id });
      if (!completedAppointment) {
        return res.status(404).json({ message: 'Completed appointment not found' });
      }
      res.status(200).json(completedAppointment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
