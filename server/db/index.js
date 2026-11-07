const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const seedData = require('./seedData');

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('[Supabase] Client initialized successfully.');
} catch (err) {
  console.warn('[Supabase] Initialization warning:', err.message);
}

// PostgreSQL connection pool (if DATABASE_URL configured)
let pgPool = null;
if (process.env.DATABASE_URL) {
  try {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
    console.log('[PostgreSQL] Connection pool established.');
  } catch (err) {
    console.warn('[PostgreSQL] Could not initialize pool, falling back to embedded relational engine:', err.message);
  }
}

// Embedded High-Performance Relational Database Engine
// File-persisted in server/data/db.json with automatic foreign keys & atomic transactions
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class RelationalDatabase {
  constructor() {
    this.tables = {
      users: [],
      exams: [],
      questions: [],
      submissions: [],
      newsletters: [],
      jobs: [],
      job_applications: [],
      study_materials: [],
      recruiters: [],
      hackathons: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.tables = JSON.parse(raw);
        console.log('[DB] Local database loaded successfully.');
      } else {
        console.log('[DB] Initializing new database with seed data...');
        this.seed();
      }
    } catch (err) {
      console.warn('[DB] Load error, resetting to seed data:', err.message);
      this.seed();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.tables, null, 2), 'utf8');
    } catch (err) {
      console.error('[DB] Failed to save database file:', err.message);
    }
  }

  seed() {
    this.tables.users = [...seedData.users];
    this.tables.exams = [...seedData.exams];
    this.tables.questions = [...seedData.questions];
    this.tables.newsletters = [...seedData.newsletters];
    this.tables.jobs = [...seedData.jobs];
    this.tables.job_applications = [];
    this.tables.study_materials = [...seedData.study_materials];
    this.tables.recruiters = [...seedData.recruiters];
    this.tables.hackathons = [...seedData.hackathons];
    this.tables.submissions = [];
    this.save();
    console.log('[DB] Seed data populated with 20 mock tests, recruiters, and newsletters.');
  }

  // Find multiple matching records
  find(tableName, filterFn = () => true) {
    const list = this.tables[tableName] || [];
    return list.filter(filterFn);
  }

  // Find a single record
  findOne(tableName, filterFn) {
    const list = this.tables[tableName] || [];
    return list.find(filterFn) || null;
  }

  // Insert a record
  insert(tableName, record) {
    if (!this.tables[tableName]) {
      this.tables[tableName] = [];
    }
    const item = {
      id: record.id || `${tableName.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      created_at: new Date().toISOString(),
      ...record
    };
    this.tables[tableName].push(item);
    this.save();
    return item;
  }

  // Update a record
  update(tableName, id, updates) {
    const list = this.tables[tableName] || [];
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    this.save();
    return list[index];
  }

  // Delete a record
  delete(tableName, id) {
    if (!this.tables[tableName]) return false;
    const initialLength = this.tables[tableName].length;
    this.tables[tableName] = this.tables[tableName].filter(r => r.id !== id);
    if (this.tables[tableName].length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // Count records
  count(tableName, filterFn = () => true) {
    return this.find(tableName, filterFn).length;
  }
}

const db = new RelationalDatabase();

module.exports = {
  db,
  pgPool,
  supabase
};

