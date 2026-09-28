import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['alumni', 'student', 'admin'], default: 'alumni' },
  title: String,
  company: String,
  department: String,
  batch: Number,
  location: String,
  bio: String,
  image: String,
  skills: [String],
  isVerified: { type: Boolean, default: false },
  isMentor: { type: Boolean, default: false },
  mentorAvailability: { type: String, enum: ['available', 'limited', 'unavailable'], default: 'unavailable' },
}, { timestamps: true })

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)