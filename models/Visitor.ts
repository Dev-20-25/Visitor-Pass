import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number.'],
  },
  email: {
    type: String,
    required: false,
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for visit.'],
  },
  signature: {
    type: String,
    required: [true, 'Please provide a signature.'],
  },
  inTime: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
