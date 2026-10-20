import "reflect-metadata"; 
import express, { response } from 'express';
import db from './database/db';
import "dotenv/config"
import errorHandler from "./middleware/errorHandler";
import authRoutes from './modules/auth/auth.route'
import userRoutes from './modules/user/user.route'

try {
 await db.initialize()
  console.log("Database has been initailized!")
} catch (error) {
  console.log("Error during database initialization: ", error)
}

const PORT = Number(process.env.PORT)
const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/', (request, response) => {
  response.status(200).send({ message: 'Hello world' })
})

app.listen(PORT, () => {
  console.log("Server listening on port: ", PORT)
})

app.use(errorHandler)