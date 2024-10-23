const mongoose = require('mongoose');

const doctorNotificationSchema = new mongoose.Schema({
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
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
  
module.exports= mongoose.model('DoctorNotification', doctorNotificationSchema);
  