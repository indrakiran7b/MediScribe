const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/dashboard/stats', appointmentController.getStats);
router.get('/doctor/recent', appointmentController.getRecentAppointments);
router.get('/doctor/appointments', appointmentController.getTodayAppointments);
router.get('/doctor/next', appointmentController.getNextAppointment);

module.exports = router;