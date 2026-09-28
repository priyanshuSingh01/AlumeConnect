import { Router } from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/mentors', protect, async (req, res, next) => {
  try {
    const mentors = await User.find({ isMentor: true, mentorAvailability: { $ne: 'unavailable' }, isVerified: true }).select('-password')
    res.json({ count: mentors.length, mentors })
  } catch (error) { next(error) }
})

router.post('/request', protect, async (req, res) => {
  const { mentorId, note } = req.body
  if (!mentorId) return res.status(400).json({ message: 'mentorId is required' })
  res.status(201).json({ message: 'Mentorship request sent', mentorId, note: note || '' })
})

export default router