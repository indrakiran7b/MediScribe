const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  specialization: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  specialty: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialty', required: true },
  experience: { type: Number, required: true },
  available: { type: Boolean, default: true },
  photoPath: { type: String }
});




doctorSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);