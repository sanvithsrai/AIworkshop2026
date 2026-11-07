const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/materials - List study materials
router.get('/', (req, res) => {
  try {
    const { category, type } = req.query;
    let list = db.find('study_materials');
    
    if (category && category !== 'All') {
      list = list.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }

    if (type === 'text') {
      list = list.filter(m => m.content && m.content.trim().length > 0);
    } else if (type === 'blog') {
      list = list.filter(m => m.blog_url && m.blog_url.trim().length > 0);
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch study materials.' });
  }
});

// POST /api/materials - Add study material (Faculty only)
router.post('/', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { 
      title, 
      category, 
      description, 
      download_url, 
      tags, 
      content,
      blog_url,
      blog_title,
      blog_source,
      blog_summary,
      read_time,
      content_type
    } = req.body;

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
      blog_url: blog_url || '',
      blog_title: blog_title || (blog_url ? title : ''),
      blog_source: blog_source || (blog_url ? 'Technical Blog' : ''),
      blog_summary: blog_summary || description,
      content_type: content_type || 'both',
      read_time: read_time || '15 min read',
      created_at: new Date().toISOString()
    });

    res.status(201).json({ message: 'Study material added successfully', material: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add study material.' });
  }
});

// PUT /api/materials/:id - Update study material (Faculty only)
router.put('/:id', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findOne('study_materials', m => m.id === id);
    if (!existing) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    const updated = db.update('study_materials', id, {
      ...existing,
      ...req.body,
      updated_at: new Date().toISOString()
    });

    res.json({ message: 'Resource updated successfully', material: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update resource.' });
  }
});

// DELETE /api/materials/:id - Delete study material (Faculty only)
router.delete('/:id', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { id } = req.params;
    const success = db.delete('study_materials', id);
    if (!success) {
      return res.status(404).json({ error: 'Resource not found.' });
    }
    res.json({ message: 'Resource deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resource.' });
  }
});

module.exports = router;
