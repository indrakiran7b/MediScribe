const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialityController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, specialtyController.getAllSpecialties);

module.exports = router;