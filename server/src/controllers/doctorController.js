const Doctor = require('../models/doctor');

exports.getDoctorsBySpecialty = async (req, res) => {
    console.log(req.params)
  try {
    const { specialtyId } = req.params;
    console.log(specialtyId)
    const doctors = await Doctor.find({ specialty: specialtyId });
    const formattedDoctors = doctors.map(({ 
      _id, firstName, lastName, specialty, experience, available, 
      photoPath, licenseNumber, availableTimeSlots, email , description,
    }) => ({
      _id,
      user: { firstName, lastName },
      specialty,
      experience,
      available,
      photoPath, // Assuming photoUrl is now photoPath
      licenseNumber,
      availableDays: availableTimeSlots.map(slot => slot.day), // Extracting available days
      email,
      description
    }));
    console.log(formattedDoctors)
    res.json(formattedDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};