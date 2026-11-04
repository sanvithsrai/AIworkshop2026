const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/materials - List study materials
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let list = db.find('study_materials');
    if (category && category !== 'All') {
      list = list.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch study materials.' });
  }
});

// POST /api/materials - Add study material (Faculty only)
router.post('/', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { title, category, description, download_url, tags, content } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required.' });
    }

    const item = db.insert('study_materials', {
      title,
      category,
      description,
      download_url: download_url || '#',
      tags: tags || 'Placement Prep',
      content: content || description,
      read_time: '15 min read'
    });

    res.status(201).json({ message: 'Study material added successfully', material: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add study material.' });
  }
});

module.exports = router;

