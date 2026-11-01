import { Router } from 'express'
import mongoose from 'mongoose'
import Connection from '../models/Connection.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = Router()
const searchRegex = (value) => new RegExp(String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

router.get('/', protect, async (req, res, next) => {
  try {
    const { search, batch, department, location, company, industry, skill } = req.query
    const filter = {
      role: { $in: ['alumni', 'student'] },
      $or: [{ isVerified: true }, { profileComplete: true }],
    }
    const searchTerm = typeof search === 'string' ? search.trim() : ''
    if (searchTerm) {
      const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const searchRegex = new RegExp(escapedSearch, 'i')
      filter.$and = [{
        $or: [
          { name: searchRegex },
          { title: searchRegex },
          { company: searchRegex },
          { department: searchRegex },
          { location: searchRegex },
          { skills: searchRegex },
        ],
      }]
    }
    if (batch) filter.batch = batch
    if (department) filter.department = searchRegex(department)
    if (location) filter.location = searchRegex(location)
    if (company) filter.company = searchRegex(company)
    if (industry) filter.title = searchRegex(industry)
    if (skill) filter.skills = searchRegex(skill)
    const alumni = await User.find(filter).select('-password').sort({ createdAt: -1 }).limit(100)
    res.json({ count: alumni.length, alumni })
  } catch (error) { next(error) }
})

router.get('/connections', protect, async (req, res, next) => {
  try {
    const connections = await Connection.find({ requester: req.user._id })
      .select('recipient status')
      .lean()
    res.json({
      connections: connections.map(({ recipient, status }) => ({
        recipientId: recipient.toString(),
        status,
      })),
    })
  } catch (error) { next(error) }
})

router.get('/locations', protect, async (req, res, next) => {
  try {
    const [result] = await User.aggregate([
      { $match: { role: { $in: ['alumni', 'student'] }, $or: [{ isVerified: true }, { profileComplete: true }] } },
      {
        $facet: {
          locations: [
            { $match: { location: { $type: 'string', $ne: '' } } },
            { $group: { _id: { $trim: { input: '$location' } }, count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 12 },
          ],
          totals: [
            {
              $group: {
                _id: null,
                profiles: { $sum: 1 },
                companies: { $addToSet: '$company' },
              },
            },
            {
              $project: {
                _id: 0,
                profiles: 1,
                companies: { $size: { $filter: { input: '$companies', as: 'company', cond: { $and: [{ $ne: ['$$company', null] }, { $ne: ['$$company', ''] }] } } } },
              },
            },
          ],
        },
      },
    ])
    res.json({
      locations: result?.locations || [],
      totalProfiles: result?.totals[0]?.profiles || 0,
      totalLocations: result?.locations.length || 0,
      totalCompanies: result?.totals[0]?.companies || 0,
    })
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
    if (req.user.role !== 'alumni') {
      delete updates.isMentor
      delete updates.mentorAvailability
    }
    const user = await User.findById(req.user._id)
    Object.assign(user, updates)
    user.profileComplete = Boolean(user.name && user.image && user.location)
    await user.save()
    user.password = undefined
    res.json(user)
  } catch (error) { next(error) }
})

router.post('/:id/connect', protect, async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user ID' })
    if (id === req.user._id.toString()) return res.status(400).json({ message: 'You cannot connect with yourself' })

    const recipient = await User.findOne({
      _id: id,
      role: { $in: ['alumni', 'student'] },
      $or: [{ isVerified: true }, { profileComplete: true }],
    }).select('_id')
    if (!recipient) return res.status(404).json({ message: 'User not found' })

    let connection = await Connection.findOne({ requester: req.user._id, recipient: recipient._id })
    if (!connection) {
      try {
        connection = await Connection.create({ requester: req.user._id, recipient: recipient._id })
      } catch (error) {
        if (error.code !== 11000) throw error
        connection = await Connection.findOne({ requester: req.user._id, recipient: recipient._id })
        if (!connection) throw error
      }
    }

    res.json({
      message: connection.status === 'accepted' ? 'You are already connected' : 'Connection request sent',
      recipientId: recipient._id,
      status: connection.status,
    })
  } catch (error) { next(error) }
})

export default router