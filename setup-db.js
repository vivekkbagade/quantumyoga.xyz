import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read from .env if needed
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  console.error("\nPlease add your PostgreSQL connection string to your .env file, for example:");
  console.error("DATABASE_URL=postgres://postgres.[your-project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres\n");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for secure connections to Supabase
  }
});

async function main() {
  try {
    console.log("Connecting to Supabase PostgreSQL database...");
    await client.connect();
    console.log("Connected successfully!");

    console.log("Reading schema.sql...");
    const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');

    console.log("Executing SQL statements...");
    await client.query(schemaSql);
    console.log("Database schema applied successfully! 'quantum_yoga_db' table created.");
  } catch (error) {
    console.error("Database setup failed:", error);
  } finally {
    await client.end();
  }
}

main();
