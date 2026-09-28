import dotenv from 'dotenv'
import { connectDatabase } from './config/db.js'
import User from './models/User.js'
import Event from './models/Event.js'
import Job from './models/Job.js'

dotenv.config()

const users = [
  { name: 'Admin User', email: 'admin@alumconnect.test', password: 'password123', role: 'admin', isVerified: true },
  { name: 'Ananya Verma', email: 'ananya@alumconnect.test', password: 'password123', role: 'alumni', title: 'Product Manager', company: 'Google', batch: 2020, location: 'Bengaluru', skills: ['Product strategy', 'Figma'], isVerified: true, isMentor: true, mentorAvailability: 'available' },
  { name: 'Priya Sharma', email: 'priya@alumconnect.test', password: 'password123', role: 'alumni', title: 'Product Designer', company: 'Atlassian', batch: 2019, location: 'Bengaluru', skills: ['Product design', 'Figma'], isVerified: true, isMentor: true, mentorAvailability: 'available' },
  { name: 'Rahul Menon', email: 'rahul@alumconnect.test', password: 'password123', role: 'alumni', title: 'Software Engineer', company: 'Microsoft', batch: 2021, location: 'Hyderabad', skills: ['React', 'Cloud'], isVerified: true },
]

async function seed() {
  await connectDatabase()
  await User.deleteMany({})
  await Event.deleteMany({})
  await Job.deleteMany({})
  const createdUsers = await User.create(users)
  const admin = createdUsers[0]
  const priya = createdUsers[2]
  await Event.create([
    { title: 'Alumni Product Circle', type: 'community', date: new Date('2026-06-18T13:30:00Z'), location: 'Online', speaker: 'Priya Sharma', createdBy: priya._id },
    { title: 'Breaking into Global Tech', type: 'career', date: new Date('2026-06-24T12:00:00Z'), location: 'Main auditorium', speaker: 'Alumni Relations', createdBy: admin._id },
  ])
  await Job.create([
    { title: 'Product Designer', company: 'Atlassian', location: 'Bengaluru · Hybrid', type: 'full-time', salary: '₹24 - 32 LPA', skills: ['Figma', 'Design systems'], postedBy: priya._id },
    { title: 'Frontend Engineering Intern', company: 'Razorpay', location: 'Remote · India', type: 'internship', salary: '₹45K / month', skills: ['React', 'TypeScript'], postedBy: priya._id },
  ])
  console.log('Seed complete')
  console.log('Admin: admin@alumconnect.test / password123')
  console.log('Alumni: ananya@alumconnect.test / password123')
  process.exit(0)
}

seed().catch((error) => { console.error(error); process.exit(1) })