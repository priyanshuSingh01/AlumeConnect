import { Router } from 'express'
import User from '../models/User.js'
import Connection from '../models/Connection.js'
import Event from '../models/Event.js'
import Job from '../models/Job.js'
import MentorshipRequest from '../models/MentorshipRequest.js'
import Message from '../models/Message.js'
import Notification from '../models/Notification.js'
import { protect } from '../middleware/auth.js'
import { createToken } from '../utils/token.js'

const router = Router()
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, image: user.image, title: user.title, company: user.company, location: user.location, department: user.department, batch: user.batch, bio: user.bio, skills: user.skills, profileComplete: user.profileComplete, isVerified: user.isVerified, isMentor: user.isMentor, mentorAvailability: user.mentorAvailability })

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'alumni' } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' })
    if (!['alumni', 'student'].includes(role)) return res.status(403).json({ message: 'Admin accounts must be created by an administrator' })
    if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists' })
    const user = await User.create({ name, email, password, role })
    res.status(201).json({ user: publicUser(user), token: createToken(user) })
  } catch (error) { next(error) }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' })
    res.json({ user: publicUser(user), token: createToken(user) })
  } catch (error) { next(error) }
})

router.get('/me', protect, async (req, res) => res.json({ user: publicUser(req.user) }))

router.delete('/me', protect, async (req, res, next) => {
  try {
    const { password } = req.body
    if (!password) return res.status(400).json({ message: 'Password is required to delete your account' })

    const user = await User.findById(req.user._id).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    const userId = user._id
    await Promise.all([
      Connection.deleteMany({ $or: [{ requester: userId }, { recipient: userId }] }),
      MentorshipRequest.deleteMany({ $or: [{ requester: userId }, { mentor: userId }] }),
      Message.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] }),
      Notification.deleteMany({ recipient: userId }),
      Event.updateMany({ createdBy: userId }, { $set: { createdBy: null } }),
      Event.updateMany({ attendees: userId }, { $pull: { attendees: userId } }),
      Job.deleteMany({ postedBy: userId }),
      Job.updateMany(
        { $or: [{ applicants: userId }, { referrals: userId }] },
        { $pull: { applicants: userId, referrals: userId } },
      ),
    ])
    await user.deleteOne()

    res.json({ message: 'Account deleted successfully' })
  } catch (error) { next(error) }
})

export default router