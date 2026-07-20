import { config } from "dotenv";
import path from "node:path";
import { Pool } from "pg";

config({ path: path.resolve(__dirname, "../../.env"), quiet: true })

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: (process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000
})

pool.on("error", () => {
  console.error("A conexão com o banco de dados foi interrompida.")
})
