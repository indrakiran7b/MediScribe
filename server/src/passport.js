const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');
const config = require('./config/config');

passport.use('patient-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, patient);
  } catch (error) {
    return done(error);
  }
}));

passport.use('doctor-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, doctor);
  } catch (error) {
    return done(error);
  }
}));

passport.use('admin-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, admin);
  } catch (error) {
    return done(error);
  }
}));

passport.use(new GoogleStrategy({
  clientID: config.googleClientID,
  clientSecret: config.googleClientSecret,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let patient = await Patient.findOne({ googleId: profile.id });
    if (patient) {
      return done(null, patient);
    }
    patient = new Patient({
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      // Note: Additional required fields need to be collected separately
    });
    await patient.save();
    done(null, patient);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, { id: user.id, model: user.constructor.modelName });
});

passport.deserializeUser(async (data, done) => {
  try {
    let Model;
    switch (data.model) {
      case 'Patient':
        Model = Patient;
        break;
      case 'Doctor':
        Model = Doctor;
        break;
      case 'Admin':
        Model = Admin;
        break;
      default:
        return done(new Error('Invalid user type'), null);
    }
    const user = await Model.findById(data.id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;