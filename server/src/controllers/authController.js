const User = require('../models/patient');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`);

exports.signup = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, dob, gender, phoneNumber, emrSystem } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      role,
      firstName,
      lastName,
      dob,
      gender,
      phoneNumber,
      emrSystem
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
};

exports.googleSignIn = async (req, res) => {
    try {
      const { token } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email } = ticket.getPayload();
  
      let user = await User.findOne({ email });
  
      if (!user) {
        // If user doesn't exist, return a "user not found" message
        return res.status(404).json({ message: 'User not found' });
      }
  
      // If user exists, update the googleId
      user.googleId = ticket.getUserId();
      await user.save();
  
      const jwtToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.json({ token: jwtToken, userId: user._id, role: user.role });
    } catch (error) {
      console.error('Google Sign-In error:', error);
      res.status(500).json({ message: 'Error during Google Sign-In', error: error.message });
    }
  };