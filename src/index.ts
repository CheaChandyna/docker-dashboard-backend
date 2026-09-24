import 'dotenv/config'
import { buildApp } from './app';
import { pool } from './database/db';

async function start() {
  const app = buildApp()

  try {
    await pool.query('SELECT 1')
    console.log('Database connection is okey')
  } catch (error) {
    console.log(error, 'Fail to connect to database')
  }

  try {
    const addresss = await app.listen({ port: Number(process.env.PORT) })
    console.log(`Server listening at ${addresss}`)
  } catch (error) {
    console.log(error, 'Somthing went wrong...');
    process.exit(1)
  }
}

start()