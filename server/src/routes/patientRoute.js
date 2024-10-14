const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/auth');

router.get('/my-profile/:id', patientController.getPatientDetails);


module.exports = router;