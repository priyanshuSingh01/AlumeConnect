import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['community', 'reunion', 'webinar', 'career'], default: 'community' },
  description: String,
  date: { type: Date, required: true },
  location: String,
  speaker: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

export default mongoose.model('Event', eventSchema)