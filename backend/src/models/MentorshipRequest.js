import mongoose from 'mongoose'

const mentorshipRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, trim: true, maxlength: 500, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, { timestamps: true })

mentorshipRequestSchema.index({ requester: 1, mentor: 1 }, { unique: true })

export default mongoose.model('MentorshipRequest', mentorshipRequestSchema)
