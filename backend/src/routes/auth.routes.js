import { Router } from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'
import { createToken } from '../utils/token.js'

const router = Router()
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, image: user.image, title: user.title, company: user.company, isVerified: user.isVerified })

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'alumni' } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' })
    if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists' })
    const user = await User.create({ name, email, password, role })
    res.status(201).json({ user: publicUser(user), token: createToken(user) })
  } catch (error) { next(error) }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' })
    res.json({ user: publicUser(user), token: createToken(user) })
  } catch (error) { next(error) }
})

router.get('/me', protect, async (req, res) => res.json({ user: req.user }))

export default router