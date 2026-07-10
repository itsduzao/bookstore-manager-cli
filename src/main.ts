import { pool } from "./database/connection";

async function main() {
  const result = await pool.query("SELECT NOW()")
  console.log(result.rows[0])
}

main()