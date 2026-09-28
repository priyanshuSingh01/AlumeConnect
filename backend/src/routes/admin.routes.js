import { Router } from 'express'
import User from '../models/User.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(protect, requireRole('admin'))

router.get('/stats', async (req, res, next) => {
  try {
    const [total, verified, active, pending] = await Promise.all([
      User.countDocuments({ role: { $in: ['alumni', 'student'] } }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ isVerified: false }),
    ])
    res.json({ total, verified, active, pending })
  } catch (error) { next(error) }
})

router.get('/verification', async (req, res, next) => {
  try { res.json({ users: await User.find({ isVerified: false }).select('-password').sort({ createdAt: -1 }) }) } catch (error) { next(error) }
})

router.patch('/verification/:id', async (req, res, next) => {
  try { const user = await User.findByIdAndUpdate(req.params.id, { isVerified: req.body.approved === true }, { new: true }).select('-password'); res.json(user) } catch (error) { next(error) }
})

export default router