const Patient = require('../models/patient'); // Assuming you have a Patient model

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