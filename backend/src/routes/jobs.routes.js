import { Router } from 'express'
import Job from '../models/Job.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.type) filter.type = req.query.type
    if (req.query.location) filter.location = new RegExp(req.query.location, 'i')
    if (req.query.search) filter.$or = [{ title: new RegExp(req.query.search, 'i') }, { company: new RegExp(req.query.search, 'i') }, { skills: new RegExp(req.query.search, 'i') }]
    const jobs = await Job.find(filter).populate('postedBy', 'name image').sort({ createdAt: -1 })
    res.json({ count: jobs.length, jobs })
  } catch (error) { next(error) }
})

router.post('/', protect, async (req, res, next) => {
  try { res.status(201).json(await Job.create({ ...req.body, postedBy: req.user._id })) } catch (error) { next(error) }
})

router.post('/:id/refer', protect, async (req, res, next) => {
  try { const job = await Job.findByIdAndUpdate(req.params.id, { $addToSet: { referrals: req.user._id } }, { new: true }); res.json({ message: 'Referral submitted', job }) } catch (error) { next(error) }
})

export default router