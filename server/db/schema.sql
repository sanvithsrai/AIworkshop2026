-- Sahyadri Placement Hub Relational PostgreSQL Schema

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student', -- 'student' | 'faculty'
    usn TEXT,
    branch TEXT DEFAULT 'Computer Science & Engineering',
    semester INTEGER DEFAULT 6,
    cgpa REAL DEFAULT 8.5,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Aptitude' | 'Japanese' | 'Technical' | 'Demo'
    subcategory TEXT,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    total_marks INTEGER NOT NULL DEFAULT 100,
    passing_marks INTEGER NOT NULL DEFAULT 50,
    difficulty TEXT NOT NULL DEFAULT 'Medium', -- 'Easy' | 'Medium' | 'Hard'
    is_demo BOOLEAN DEFAULT FALSE,
    banner_gradient TEXT,
    created_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL, -- 'A' | 'B' | 'C' | 'D'
    explanation TEXT,
    marks INTEGER DEFAULT 5,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    percentage REAL NOT NULL,
    passed BOOLEAN NOT NULL,
    time_taken_seconds INTEGER,
    answers_json TEXT, -- Record of selected options
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletters (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    edition TEXT NOT NULL,
    publish_date DATE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    read_time TEXT DEFAULT '5 min read',
    tags TEXT,
    pdf_url TEXT,
    created_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    logo TEXT,
    ctc TEXT NOT NULL,
    location TEXT NOT NULL,
    deadline DATE NOT NULL,
    apply_url TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'Full Time',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_materials (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Aptitude' | 'Technical' | 'Japanese' | 'Interview'
    description TEXT NOT NULL,
    download_url TEXT,
    external_link TEXT,
    read_time TEXT DEFAULT '10 min',
    tags TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recruiters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    status TEXT NOT NULL, -- 'Attended' | 'Upcoming' | 'Ongoing'
    sector TEXT,
    highest_package TEXT,
    avg_package TEXT,
    offers_made INTEGER DEFAULT 0,
    visit_date TEXT,
    eligibility TEXT,
    roles_offered TEXT
);

CREATE TABLE IF NOT EXISTS hackathons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    organizer TEXT NOT NULL,
    category TEXT NOT NULL, -- 'National' | 'Regional' | 'Global'
    mode TEXT DEFAULT 'Online/Hybrid',
    dates TEXT NOT NULL,
    prize_pool TEXT,
    registration_link TEXT NOT NULL,
    description TEXT,
    tags TEXT
);

