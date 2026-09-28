import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: String,
  type: { type: String, enum: ['connection', 'event', 'job', 'system'], default: 'system' },
  read: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Notification', notificationSchema)