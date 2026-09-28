import app from './app.js'
import { connectDatabase } from './config/db.js'

const port = process.env.PORT || 5000

connectDatabase()
  .then(() => app.listen(port, () => console.log(`AlumConnect API running on http://localhost:${port}`)))
  .catch((error) => {
    console.error(`Server startup failed: ${error.message}`)
    process.exit(1)
  })