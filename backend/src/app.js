import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler, notFound } from './middleware/errors.js'
import authRoutes from './routes/auth.routes.js'
import alumniRoutes from './routes/alumni.routes.js'
import mentorshipRoutes from './routes/mentorship.routes.js'
import jobsRoutes from './routes/jobs.routes.js'
import eventsRoutes from './routes/events.routes.js'
import messagesRoutes from './routes/messages.routes.js'
import notificationsRoutes from './routes/notifications.routes.js'
import adminRoutes from './routes/admin.routes.js'

dotenv.config()
const app = express()
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'alumconnect-api' }))
app.use('/api/auth', authRoutes)
app.use('/api/alumni', alumniRoutes)
app.use('/api/mentorship', mentorshipRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/admin', adminRoutes)
app.use(notFound)
app.use(errorHandler)

export default app