import { Router } from 'express'
import mongoose from 'mongoose'
import Message from '../models/Message.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/:userId', protect, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) return res.status(400).json({ message: 'Invalid user ID' })
    if (req.params.userId === req.user._id.toString()) return res.status(400).json({ message: 'You cannot open a conversation with yourself' })
    if (!await User.exists({ _id: req.params.userId, role: { $in: ['alumni', 'student'] } })) return res.status(404).json({ message: 'User not found' })
    const messages = await Message.find({ $or: [{ sender: req.user._id, receiver: req.params.userId }, { sender: req.params.userId, receiver: req.user._id }] }).sort({ createdAt: 1 })
    await Message.updateMany({ sender: req.params.userId, receiver: req.user._id }, { read: true })
    res.json({ messages })
  } catch (error) { next(error) }
})

router.post('/:userId', protect, async (req, res, next) => {
  try {
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : ''
    if (!mongoose.isValidObjectId(req.params.userId)) return res.status(400).json({ message: 'Invalid user ID' })
    if (req.params.userId === req.user._id.toString()) return res.status(400).json({ message: 'You cannot message yourself' })
    if (!text || text.length > 2000) return res.status(400).json({ message: 'Message must be between 1 and 2,000 characters' })
    if (!await User.exists({ _id: req.params.userId, role: { $in: ['alumni', 'student'] } })) return res.status(404).json({ message: 'User not found' })
    const message = await Message.create({ sender: req.user._id, receiver: req.params.userId, text })
    res.status(201).json(message)
  } catch (error) { next(error) }
})

export default router