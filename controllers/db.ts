import { Pool } from "pg";
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: Number(process.env.DB_PORT)
})
