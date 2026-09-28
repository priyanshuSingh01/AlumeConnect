import { Router } from 'express'
import Notification from '../models/Notification.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res, next) => {
  try { res.json({ notifications: await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }) }) } catch (error) { next(error) }
})

router.patch('/:id/read', protect, async (req, res, next) => {
  try { res.json(await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { read: true }, { new: true })) } catch (error) { next(error) }
})

export default router