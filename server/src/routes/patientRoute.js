const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/auth');

router.get('/my-profile/:id', patientController.getPatientDetails);
router.get('/medicalHistory/:id', patientController.getPatientMedicalHistory);
router.get('/medical-history/details/:id', patientController.getCompletedAppointmentDetails)

module.exports = router;