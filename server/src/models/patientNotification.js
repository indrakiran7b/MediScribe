
const mongoose = require('mongoose');
const patientNotificationSchema = new mongoose.Schema({
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    BookedAt: {
      type: Date,
      default: Date.now
    }
  });
  

module.exports=  mongoose.model('PatientNotification', patientNotificationSchema);
  