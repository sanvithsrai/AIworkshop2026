const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/newsletters - List all published newsletters
router.get('/', (req, res) => {
  try {
    const list = db.find('newsletters')
      .sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch newsletters.' });
  }
});

// GET /api/newsletters/:id - Get specific newsletter
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const item = db.findOne('newsletters', n => n.id === id);
  if (!item) return res.status(404).json({ error: 'Newsletter not found.' });
  res.json(item);
});

// POST /api/newsletters - Publish newsletter (Faculty only)
router.post('/', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { title, edition, publish_date, summary, content, cover_image, tags, read_time } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    const newItem = db.insert('newsletters', {
      title,
      edition: edition || `Vol. ${new Date().getFullYear()} - Issue ${Math.floor(10 + Math.random() * 80)}`,
      publish_date: publish_date || new Date().toISOString().split('T')[0],
      summary: summary || title,
      content,
      cover_image: cover_image || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600',
      tags: tags || 'Placements, Career Tips',
      read_time: read_time || '5 min read',
      created_by: req.user.name
    });

    res.status(201).json({ message: 'Newsletter published successfully', newsletter: newItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish newsletter.' });
  }
});

// DELETE /api/newsletters/:id - Delete newsletter (Faculty only)
router.delete('/:id', requireAuth, requireRole('faculty'), (req, res) => {
  const { id } = req.params;
  const deleted = db.delete('newsletters', id);
  if (!deleted) return res.status(404).json({ error: 'Newsletter not found' });
  res.json({ message: 'Newsletter deleted successfully.' });
});

module.exports = router;

