import { Router } from 'express'
import Message from '../models/Message.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/:userId', protect, async (req, res, next) => {
  try {
    const messages = await Message.find({ $or: [{ sender: req.user._id, receiver: req.params.userId }, { sender: req.params.userId, receiver: req.user._id }] }).sort({ createdAt: 1 })
    await Message.updateMany({ sender: req.params.userId, receiver: req.user._id }, { read: true })
    res.json({ messages })
  } catch (error) { next(error) }
})

router.post('/:userId', protect, async (req, res, next) => {
  try { const message = await Message.create({ sender: req.user._id, receiver: req.params.userId, text: req.body.text }); res.status(201).json(message) } catch (error) { next(error) }
})

export default router