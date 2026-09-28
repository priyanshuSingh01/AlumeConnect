import { Router } from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res, next) => {
  try {
    const { search, batch, department, location, company, industry, skill } = req.query
    const filter = { role: { $in: ['alumni', 'student'] }, isVerified: true }
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { title: new RegExp(search, 'i') }, { company: new RegExp(search, 'i') }, { skills: new RegExp(search, 'i') }]
    if (batch) filter.batch = batch
    if (department) filter.department = new RegExp(department, 'i')
    if (location) filter.location = new RegExp(location, 'i')
    if (company) filter.company = new RegExp(company, 'i')
    if (industry) filter.title = new RegExp(industry, 'i')
    if (skill) filter.skills = new RegExp(skill, 'i')
    const alumni = await User.find(filter).select('-password').sort({ createdAt: -1 }).limit(100)
    res.json({ count: alumni.length, alumni })
  } catch (error) { next(error) }
})

router.get('/:id', protect, async (req, res, next) => {
  try {
    const alumni = await User.findById(req.params.id).select('-password')
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' })
    res.json(alumni)
  } catch (error) { next(error) }
})

router.put('/me', protect, async (req, res, next) => {
  try {
    const allowed = ['name', 'title', 'company', 'department', 'batch', 'location', 'bio', 'image', 'skills', 'isMentor', 'mentorAvailability']
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)))
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password')
    res.json(user)
  } catch (error) { next(error) }
})

router.post('/:id/connect', protect, async (req, res) => res.json({ message: 'Connection request sent', recipientId: req.params.id }))

export default router