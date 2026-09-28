import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let memoryServer

export async function connectDatabase() {
  if (process.env.USE_MEMORY_DB === 'true') {
    memoryServer = await MongoMemoryServer.create()
    await mongoose.connect(memoryServer.getUri(), { serverSelectionTimeoutMS: 5000 })
    console.log('Temporary in-memory MongoDB connected')
    return
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env')
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  console.log('MongoDB connected')
}