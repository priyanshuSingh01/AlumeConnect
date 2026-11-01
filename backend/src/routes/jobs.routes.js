import { Router } from 'express'
import mongoose from 'mongoose'
import Job from '../models/Job.js'
import Notification from '../models/Notification.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.type) filter.type = req.query.type
    if (typeof req.query.location === 'string' && req.query.location.trim()) {
      filter.location = new RegExp(req.query.location.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    }
    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      const term = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(term, 'i')
      filter.$or = [{ title: regex }, { company: regex }, { skills: regex }, { location: regex }]
    }
    const jobs = await Job.find(filter).populate('postedBy', 'name image').sort({ createdAt: -1 })
    res.json({ count: jobs.length, jobs })
  } catch (error) { next(error) }
})

router.post('/', protect, requireRole('alumni', 'admin'), async (req, res, next) => {
  try {
    const { title, company, location, type, salary, description, applicationUrl, skills } = req.body
    if (!title?.trim() || !company?.trim()) return res.status(400).json({ message: 'Job title and company are required' })
    if (applicationUrl && !/^https?:\/\//i.test(applicationUrl)) return res.status(400).json({ message: 'Application URL must start with http:// or https://' })
    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location,
      type,
      salary,
      description,
      applicationUrl,
      skills: Array.isArray(skills) ? skills : [],
      postedBy: req.user._id,
    })
    res.status(201).json(job)
  } catch (error) { next(error) }
})

router.post('/:id/refer', protect, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid job ID' })
    const job = await Job.findByIdAndUpdate(req.params.id, { $addToSet: { referrals: req.user._id } }, { new: true })
    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json({ message: 'Referral submitted', job })
  } catch (error) { next(error) }
})

router.post('/:id/apply', protect, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid job ID' })
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found' })
    if (job.postedBy.equals(req.user._id)) return res.status(400).json({ message: 'You cannot apply to your own job post' })
    const isNewApplication = !job.applicants.some((applicant) => applicant.equals(req.user._id))
    if (isNewApplication) {
      job.applicants.push(req.user._id)
      await job.save()
      await Notification.create({
        recipient: job.postedBy,
        title: 'New job application interest',
        body: `${req.user.name} is interested in your ${job.title} role.`,
        type: 'job',
      })
    }
    res.json({ message: 'Your interest has been shared with the job poster', applied: true })
  } catch (error) { next(error) }
})

export default router