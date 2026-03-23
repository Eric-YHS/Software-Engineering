const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
};

// Parse connection string to get database name
// Format: postgresql://user:password@host:port/dbname
const match = process.env.DATABASE_URL.match(/\/[^\/]+$/);
const dbName = match ? match[0].substring(1) : 'community_db';

// Connection to 'postgres' db to create the target db if it doesn't exist
const adminConfig = {
  connectionString: process.env.DATABASE_URL.replace(/\/[^\/]+$/, '/postgres'),
};

async function setup() {
  console.log('Starting Database Setup...');

  // 1. Create Database if not exists
  const adminClient = new Client(adminConfig);
  try {
    await adminClient.connect();
    const res = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    if (res.rowCount === 0) {
      console.log(`Database '${dbName}' does not exist. Creating...`);
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' created.`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err.message);
    // If we can't connect to postgres db, maybe the URL is already pointing to a valid DB or user doesn't have permission.
    // We'll proceed to try connecting to the target DB directly.
  } finally {
    await adminClient.end();
  }

  // 2. Connect to Target Database and Run Scripts
  const client = new Client(dbConfig);
  try {
    await client.connect();
    console.log(`Connected to '${dbName}'. Executing schemas...`);

    const schemaDir = path.join(__dirname, '../../database');
    const files = [
      'schema.sql',
      'triggers.sql',
      'procedures.sql',
      'views.sql',
      'seeds.sql'
    ];

    for (const file of files) {
      const filePath = path.join(schemaDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`Executing ${file}...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
      } else {
        console.warn(`Warning: ${file} not found.`);
      }
    }

    console.log('Database setup completed successfully!');
  } catch (err) {
    console.error('Error executing SQL scripts:', err);
  } finally {
    await client.end();
  }
}

setup();
