const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/auth');

router.get('/specialty/:specialtyId', authenticateToken, doctorController.getDoctorsBySpecialty);


module.exports = router;