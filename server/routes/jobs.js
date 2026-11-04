const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/auth');

// GET /api/jobs - List all verified jobs
router.get('/', optionalAuth, (req, res) => {
  try {
    const jobs = db.find('jobs');
    const userId = req.user ? req.user.id : null;
    const appliedJobIds = userId
      ? new Set(db.find('job_applications', a => a.user_id === userId).map(a => a.job_id))
      : new Set();

    const enriched = jobs.map(j => ({
      ...j,
      applied: appliedJobIds.has(j.id)
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

// POST /api/jobs/:id/apply - Record application click / track status
router.post('/:id/apply', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const job = db.findOne('jobs', j => j.id === id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    const existing = db.findOne('job_applications', a => a.user_id === req.user.id && a.job_id === id);
    if (!existing) {
      db.insert('job_applications', {
        user_id: req.user.id,
        job_id: id,
        applied_at: new Date().toISOString()
      });
    }

    res.json({ message: 'Application recorded', apply_url: job.apply_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply.' });
  }
});

// POST /api/jobs - Add verified job (Faculty only)
router.post('/', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { company, role, ctc, location, deadline, apply_url, eligibility, description, type } = req.body;
    if (!company || !role || !apply_url) {
      return res.status(400).json({ error: 'Company, role, and application URL are required.' });
    }

    const newJob = db.insert('jobs', {
      company,
      role,
      ctc: ctc || 'Competitive CTC',
      location: location || 'Pan-India',
      deadline: deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      apply_url,
      eligibility: eligibility || 'B.E All Branches',
      description: description || 'Exciting career opportunity for Sahyadri graduates.',
      type: type || 'Full Time',
      is_verified: true,
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100'
    });

    res.status(201).json({ message: 'Job added successfully', job: newJob });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add job.' });
  }
});

// DELETE /api/jobs/:id - Delete job (Faculty only)
router.delete('/:id', requireAuth, requireRole('faculty'), (req, res) => {
  const { id } = req.params;
  const deleted = db.delete('jobs', id);
  if (!deleted) return res.status(404).json({ error: 'Job not found' });
  res.json({ message: 'Job deleted successfully.' });
});

module.exports = router;

