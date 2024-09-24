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
    const { email, password, firstName, lastName, dob, phoneNumber, ehrSystem, gender } = req.body;
    const existingPatient = await Patient.findOne({ email });

    if (existingPatient) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const [day, month, year] = dob
    const formattedDob = new Date(`${year}-${month}-${day}`);
    const newPatient = new Patient({
      email,
      password,
      firstName,
      lastName,
      dob: formattedDob,
      phoneNumber,
      ehrSystem,
      gender
    });

    await newPatient.save();
    res.status(201).json({ message: 'Patient account created successfully' });
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

// Google signin for patients
router.get('/auth/google-signin', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google-signin/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      let patient = await Patient.findOne({ googleId: req.user.id });
      
      if (!patient) {
        patient = new Patient({
          googleId: req.user.id,
          email: req.user.emails[0].value,
          firstName: req.user.name.givenName,
          lastName: req.user.name.familyName,
          // Note: Additional required fields need to be collected separately
        });
        await patient.save();
      }

      const token = jwt.sign({ id: patient._id, userType: 'patient' }, config.jwtSecret, { expiresIn: '1d' });
      res.redirect(`/auth-success?token=${token}`);
    } catch (error) {
      res.status(500).json({ message: 'Error with Google authentication', error: error.message });
    }
  }
);

module.exports = router;