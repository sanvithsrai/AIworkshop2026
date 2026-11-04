const express = require('express');
const router = express.Router();
const axios = require('axios');
const { db } = require('../db');

const NEWS_API_KEY = process.env.NEWS_API_KEY;

// In-memory cache for live news
let cachedLiveEvents = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 mins

// GET /api/hackathons - List curated hackathons and live tech competition feeds
router.get('/', async (req, res) => {
  try {
    const curatedHackathons = db.find('hackathons');

    let liveArticles = [];
    const now = Date.now();

    if (cachedLiveEvents && (now - lastFetchTime < CACHE_DURATION_MS)) {
      liveArticles = cachedLiveEvents;
    } else {
      try {
        const response = await axios.get('https://newsdata.io/api/1/news', {
          params: {
            apikey: NEWS_API_KEY,
            q: 'hackathon OR "coding competition"',
            language: 'en'
          },
          timeout: 4000
        });

        if (response.data && response.data.results) {
          liveArticles = response.data.results.slice(0, 6).map(item => ({
            id: `live_${item.article_id || Math.random()}`,
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source_id: item.source_id,
            description: item.description || item.snippet,
            image_url: item.image_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600'
          }));
          cachedLiveEvents = liveArticles;
          lastFetchTime = now;
        }
      } catch (apiErr) {
        console.warn('[NewsAPI] Could not fetch live news, using curated backup:', apiErr.message);
        liveArticles = cachedLiveEvents || [];
      }
    }

    res.json({
      hackathons: curatedHackathons,
      liveNews: liveArticles
    });
  } catch (err) {
    console.error('Hackathons error:', err);
    res.status(500).json({ error: 'Failed to load hackathons.' });
  }
});

module.exports = router;

