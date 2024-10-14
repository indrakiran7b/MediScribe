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


exports.getDoctorById = async (req, res) => {
  try {
    console.log(req.params)
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const formattedDoctor = {
      _id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      experience: doctor.experience,
      available: doctor.available,
      photoPath: doctor.photoPath,
      description: doctor.description,
      education: doctor.education,
      email: doctor.email,
      availableTimeSlots: doctor.availableTimeSlots
    };

    res.json(formattedDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
};