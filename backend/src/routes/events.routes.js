import { Router } from 'express'
import Event from '../models/Event.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res, next) => {
	try {
		const events = await Event.find({ date: { $gte: new Date() } })
			.populate('createdBy', 'name image')
			.sort({ date: 1 })

		res.json({ events })
	} catch (error) {
		next(error)
	}
})

router.post('/', protect, async (req, res, next) => {
	try {
		const event = await Event.create({ ...req.body, createdBy: req.user._id })
		res.status(201).json(event)
	} catch (error) {
		next(error)
	}
})

router.post('/:id/register', protect, async (req, res, next) => {
	try {
		const event = await Event.findByIdAndUpdate(
			req.params.id,
			{ $addToSet: { attendees: req.user._id } },
			{ new: true },
		)

		if (!event) return res.status(404).json({ message: 'Event not found' })
		res.json({ message: 'Registered for event', event })
	} catch (error) {
		next(error)
	}
})

export default router
