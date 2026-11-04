const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      branch: user.branch || 'CSE'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findOne('users', u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Direct password check fallback for default credentials
    const isDirectMatch = (password === 'SAHYADRI' && (cleanEmail === 'sanvith.rai.ci24@sahyadri.edu.in' || cleanEmail === 'admin@sahyadri.edu.in'));
    let isValid = isDirectMatch;

    if (!isValid && user.password) {
      isValid = await bcrypt.compare(password, user.password);
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPass } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', usn, branch, semester, cgpa } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.findOne('users', u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = db.insert('users', {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role === 'faculty' ? 'faculty' : 'student',
      usn: usn ? usn.trim().toUpperCase() : `4SF${Math.floor(10 + Math.random() * 89)}CS${Math.floor(100 + Math.random() * 899)}`,
      branch: branch || 'Computer Science & Engineering',
      semester: Number(semester) || 6,
      cgpa: Number(cgpa) || 8.0,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    const token = generateToken(newUser);
    const { password: _, ...userWithoutPass } = newUser;

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/google
// One-click Sahyadri Google Workspace authentication
router.post('/google', async (req, res) => {
  try {
    const { email, name, avatar, googleId } = req.body;
    const targetEmail = (email || 'sanvith.rai.ci24@sahyadri.edu.in').trim().toLowerCase();
    const targetName = name || (targetEmail.includes('sanvith') ? 'Sanvith Rai' : 'Sahyadri Scholar');

    let user = db.findOne('users', u => u.email.toLowerCase() === targetEmail);

    if (!user) {
      user = db.insert('users', {
        name: targetName,
        email: targetEmail,
        password: await bcrypt.hash('GOOGLE_AUTH_' + Math.random(), 10),
        role: targetEmail.includes('admin') ? 'faculty' : 'student',
        usn: `4SF22CI048`,
        branch: 'Computer Science & Engineering',
        semester: 6,
        cgpa: 8.85,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        google_id: googleId || 'google_auth_demo'
      });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPass } = user;

    res.json({
      message: 'Google authentication successful',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Server error during Google login.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const user = db.findOne('users', u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  const submissions = db.find('submissions', s => s.user_id === user.id);
  const testsCompleted = submissions.length;
  const avgScore = testsCompleted > 0
    ? Math.round(submissions.reduce((acc, s) => acc + s.percentage, 0) / testsCompleted)
    : 0;

  const { password: _, ...userWithoutPass } = user;

  res.json({
    user: userWithoutPass,
    stats: {
      testsCompleted,
      avgScore,
      placementReadiness: Math.min(100, Math.round((user.cgpa * 7) + (avgScore * 0.3)))
    }
  });
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, (req, res) => {
  const { name, usn, branch, semester, cgpa } = req.body;
  const updated = db.update('users', req.user.id, {
    ...(name && { name }),
    ...(usn && { usn: usn.toUpperCase() }),
    ...(branch && { branch }),
    ...(semester && { semester: Number(semester) }),
    ...(cgpa && { cgpa: Number(cgpa) })
  });

  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...cleanUser } = updated;
  res.json({ message: 'Profile updated successfully', user: cleanUser });
});

module.exports = router;

