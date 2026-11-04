const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/recruiters - List attended, ongoing, and upcoming recruiters
router.get('/', (req, res) => {
  try {
    const list = db.find('recruiters');

    const attended = list.filter(r => r.status === 'Attended');
    const upcoming = list.filter(r => r.status === 'Upcoming' || r.status === 'Ongoing');

    const totalOffers = attended.reduce((acc, r) => acc + (r.offers_made || 0), 0);
    const highestPackage = "₹47.24 LPA (Belc Japan)";
    const averagePackage = "₹6.3 LPA";

    res.json({
      all: list,
      attended,
      upcoming,
      stats: {
        totalVisited: attended.length,
        upcomingCount: upcoming.length,
        totalOffers,
        highestPackage,
        averagePackage,
        totalCompaniesVisitingAnnual: '250+'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recruiters.' });
  }
});

// POST /api/recruiters - Add recruiter (Faculty only)
router.post('/', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { name, status, sector, highest_package, avg_package, offers_made, visit_date, eligibility, roles_offered } = req.body;
    if (!name || !status) {
      return res.status(400).json({ error: 'Company name and status are required.' });
    }

    const item = db.insert('recruiters', {
      name,
      status,
      sector: sector || 'Information Technology',
      highest_package: highest_package || '10.0 LPA',
      avg_package: avg_package || '6.5 LPA',
      offers_made: Number(offers_made) || 0,
      visit_date: visit_date || 'Upcoming 2026',
      eligibility: eligibility || 'All Circuit Branches',
      roles_offered: roles_offered || 'Associate Software Engineer',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100'
    });

    res.status(201).json({ message: 'Recruiter added successfully', recruiter: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add recruiter.' });
  }
});

module.exports = router;

