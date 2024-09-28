const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');
const config = require('../config/config');

const router = express.Router();

// Patient signup
router.post('/auth/signup', async (req, res) => {
  try {
    console.log(req.body)
    const { email, password, firstName, lastName, dob, phoneNumber, emrSystem, gender } = req.body;
    const existingPatient = await Patient.findOne({ email });
    console.log(existingPatient)
    if (existingPatient) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    console.log('nvjfn')
    
    const formattedDob = new Date(`${dob['year']}-${dob['month']}-${dob['day']}`);
    console.log(formattedDob)
    const newPatient = await Patient({
      email,
      password,
      firstName,
      lastName,
      dob: formattedDob,
      phoneNumber,
      emrSystem,
      gender
    });
    await newPatient.save();
    const token = jwt.sign({ id: newPatient._id, userType: 'patient' }, config.jwtSecret, { expiresIn: '1d' });

    // Respond with the token, userType, and success message
    res.status(201).json({
      message: 'Patient account created successfully',
      token:token,
      userType: 'patient'
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient account', error: error.message });
  }
});

// Signin
router.post('/auth/login', async (req, res) => {

    
  const { email, password, userType } = req.body;
  console.log('Received login request:', req.body);
  let User;

  switch (userType) {
    case 'patient':
      User = Patient;
      break;
    case 'doctor':
      User = Doctor;
      break;
    case 'admin':
      User = Admin;
      break;
    default:
      return res.status(400).json({ message: 'Invalid user type' });
  }
  const user = await User.findOne({ email });
  console.log('hi',User, user);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log('email is matched')
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log('password is matched')
    const token = jwt.sign({ id: user._id, userType }, config.jwtSecret, { expiresIn: '1d' });
    console.log('SignIn is successful');
    res.json({ token, userType });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error: error.message });
    console.log('SignIn is error');
  }
});


module.exports = router;