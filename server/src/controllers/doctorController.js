const Doctor = require('../models/doctor');

exports.getDoctorsBySpecialty = async (req, res) => {
    console.log(req.params)
  try {
    const { specialtyId } = req.params;
    console.log(specialtyId)
    const doctors = await Doctor.find({ specialty: specialtyId });
    const formattedDoctors = doctors.map(doctor => ({
        _id: doctor._id,
        user: {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
        },
        specialty: doctor.specialty,  // Assuming specialty is populated correctly
        experience: doctor.experience,
        available: doctor.available,
        photoPath: doctor.photoUrl,  // Assuming photoUrl field in your DB
        education: doctor.education,
        licenseNumber: doctor.licenseNumber,
        consultationFee: doctor.consultationFee,
        availableDays: doctor.availableDays,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
      }));
    console.log(formattedDoctors)
    res.json(formattedDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};