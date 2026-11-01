import { Router } from 'express'
import User from '../models/User.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(protect, requireRole('admin'))

router.get('/stats', async (req, res, next) => {
  try {
    const memberFilter = { role: { $in: ['alumni', 'student'] } }
    const [total, verified, active, pending, batches, roles] = await Promise.all([
      User.countDocuments(memberFilter),
      User.countDocuments({ ...memberFilter, isVerified: true }),
      User.countDocuments({ ...memberFilter, updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ ...memberFilter, isVerified: false, verificationStatus: { $ne: 'rejected' } }),
      User.aggregate([
        { $match: { ...memberFilter, batch: { $type: 'number' } } },
        { $group: { _id: '$batch', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
      User.aggregate([
        { $match: memberFilter },
        { $project: { label: { $ifNull: ['$company', '$title'] } } },
        { $match: { label: { $type: 'string', $ne: '' } } },
        { $group: { _id: '$label', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 6 },
      ]),
    ])
    res.json({ total, verified, active, pending, batches, roles })
  } catch (error) { next(error) }
})

router.get('/verification', async (req, res, next) => {
  try { res.json({ users: await User.find({ isVerified: false, verificationStatus: { $ne: 'rejected' } }).select('-password').sort({ createdAt: -1 }) }) } catch (error) { next(error) }
})

router.patch('/verification/:id', async (req, res, next) => {
  try {
    if (typeof req.body.approved !== 'boolean') return res.status(400).json({ message: 'approved must be a boolean' })
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.approved, verificationStatus: req.body.approved ? 'approved' : 'rejected' },
      { new: true, runValidators: true },
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) { next(error) }
})

export default router