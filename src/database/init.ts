import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

config({ path: path.resolve(__dirname, "../../.env"), quiet: false });

async function initializeDatabase() {
  const schemaPath = path.resolve(__dirname, "schema.sql");
  const schema = await readFile(schemaPath, "utf8");
  const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await pool.query(schema);
    console.log("Esquema do banco de dados inicializado com sucesso.");
  } finally {
    await pool.end();
  }
}

initializeDatabase().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Erro desconhecido.";
  console.error(`Não foi possível inicializar o banco de dados: ${message}`);
  process.exitCode = 1;
});
