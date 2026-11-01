import { Router } from 'express'
import mongoose from 'mongoose'
import MentorshipRequest from '../models/MentorshipRequest.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/mentors', protect, async (req, res, next) => {
  try {
    const mentors = await User.find({
      _id: { $ne: req.user._id },
      role: 'alumni',
      isMentor: true,
      mentorAvailability: { $in: ['available', 'limited'] },
      isVerified: true,
    }).select('-password').sort({ mentorAvailability: 1, name: 1 })
    res.json({ count: mentors.length, mentors })
  } catch (error) { next(error) }
})

router.get('/requests', protect, async (req, res, next) => {
  try {
    const [requests, incomingRequests] = await Promise.all([
      MentorshipRequest.find({ requester: req.user._id })
      .populate('mentor', 'name title company image')
      .sort({ createdAt: -1 }),
      MentorshipRequest.find({ mentor: req.user._id })
        .populate('requester', 'name title company image role')
        .sort({ createdAt: -1 }),
    ])
    res.json({ requests, incomingRequests })
  } catch (error) { next(error) }
})

router.post('/requests/:id/respond', protect, async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid request ID' })
    if (!['accepted', 'declined'].includes(status)) return res.status(400).json({ message: 'Status must be accepted or declined' })

    const request = await MentorshipRequest.findOne({ _id: id, mentor: req.user._id })
      .populate('requester', 'name')
    if (!request) return res.status(404).json({ message: 'Mentorship request not found' })
    if (request.status !== 'pending') return res.status(409).json({ message: 'This mentorship request has already been answered' })

    request.status = status
    await request.save()
    await Notification.create({
      recipient: request.requester._id,
      title: status === 'accepted' ? 'Mentorship request accepted' : 'Mentorship request declined',
      body: `${req.user.name} ${status === 'accepted' ? 'accepted' : 'declined'} your mentorship request.`,
      type: 'mentorship',
    })
    res.json({ message: `Mentorship request ${status}`, request })
  } catch (error) { next(error) }
})

router.post('/request', protect, async (req, res, next) => {
  try {
    const { mentorId, note = '' } = req.body
    if (!mongoose.isValidObjectId(mentorId)) return res.status(400).json({ message: 'A valid mentorId is required' })
    if (typeof note !== 'string' || note.length > 500) return res.status(400).json({ message: 'Your note must be 500 characters or fewer' })
    if (mentorId === req.user._id.toString()) return res.status(400).json({ message: 'You cannot request mentorship from yourself' })

    const mentor = await User.findOne({
      _id: mentorId,
      role: 'alumni',
      isMentor: true,
      mentorAvailability: { $in: ['available', 'limited'] },
      isVerified: true,
    }).select('_id name')
    if (!mentor) return res.status(404).json({ message: 'This mentor is no longer available' })

    let request = await MentorshipRequest.findOne({ requester: req.user._id, mentor: mentor._id })
    let isNewRequest = false
    if (!request) {
      try {
        request = await MentorshipRequest.create({ requester: req.user._id, mentor: mentor._id, note: note.trim() })
        isNewRequest = true
      } catch (error) {
        if (error.code !== 11000) throw error
        request = await MentorshipRequest.findOne({ requester: req.user._id, mentor: mentor._id })
        if (!request) throw error
      }
    } else if (request.status === 'declined') {
      request.status = 'pending'
      request.note = note.trim()
      await request.save()
      isNewRequest = true
    }

    if (isNewRequest) {
      await Notification.create({
        recipient: mentor._id,
        title: 'New mentorship request',
        body: `${req.user.name} would like your mentorship.${note.trim() ? ` ${note.trim()}` : ''}`,
        type: 'mentorship',
      })
    }

    res.status(isNewRequest ? 201 : 200).json({ message: 'Mentorship request sent', request })
  } catch (error) { next(error) }
})

export default router