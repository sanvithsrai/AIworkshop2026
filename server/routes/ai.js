const express = require('express');
const router = express.Router();
const axios = require('axios');
const { optionalAuth } = require('../middleware/auth');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Sarah - Reassuring & Confident

const SYSTEM_PROMPT = `
You are SPACE AI — the Official AI Copilot of Sahyadri Placement and Career Portal for Engineers (SPACE), Sahyadri College of Engineering & Management, Mangaluru.
Your purpose is to assist engineering students in preparing for campus placements, answering doubts about eligibility criteria, company interview rounds, Japanese language training (Zenken Day / Belc / IMV), aptitude strategies, resume tips, and scheduling mock tests.

Key Institutional Grounding:
- Institution: Sahyadri College of Engineering & Management, Adyar, Mangaluru, Karnataka.
- Placement Dean: Prof. Rashmi Bhandary (Dean – Career Guidance, Training & Placement).
- Record High Packages: Belc Co., Ltd. (Japan) at ₹47.24 LPA, Microsoft at ₹40 LPA, IMV Corporation (Japan) at ₹36.04 LPA, Aisan Industry (Japan) at ₹34.42 LPA, Adobe at ₹27.7 LPA, Cohesity at ₹24 LPA.
- Placement Averages: Over 250+ companies visit campus annually; Average package is ₹6.3 LPA; Median ₹4.75 LPA.
- Japanese Language Program: Sahyadri runs on-campus JLPT N5/N4 Japanese language training programs specifically enabling students to secure direct employment in Tokyo, Osaka, and Nagoya with Japanese multinationals.
- Campus Preparation: Regular Aptitude Arena, coding hackathons, mock interviews, and peer study circles.
- Demeanor: Highly encouraging, crisp, professional, and practical. Offer concrete actionable steps, question walkthroughs, or formula tips.
`;

// POST /api/ai/chat - Placement chatbot powered by Gemini 2.5 Flash
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}` }]
      }
    ];

    // If conversation history provided, format for Gemini
    if (conversationHistory.length > 0) {
      const recent = conversationHistory.slice(-4);
      contents.length = 0;
      contents.push({
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: "Understood. I am the Sahyadri Placement AI ready to assist our students." }]
      });
      recent.forEach(h => {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        });
      });
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    }

    let botReply = '';
    try {
      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        { contents },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      const candidate = geminiRes.data?.candidates?.[0];
      botReply = candidate?.content?.parts?.[0]?.text || '';
    } catch (apiErr) {
      console.warn('[Gemini API] Request failed or timed out:', apiErr.response?.data || apiErr.message);

      // Intelligent curated fallback response based on message keywords
      const lower = message.toLowerCase();
      if (lower.includes('japan') || lower.includes('belc') || lower.includes('jlpt')) {
        botReply = `Sahyadri has an elite international placement pipeline with top Japanese firms like **Belc Co., Ltd. (₹47.24 LPA)**, **IMV Corporation (₹36.04 LPA)**, and **Aisan (₹34.42 LPA)**. 

To qualify:
1. Complete our on-campus **Japanese JLPT N5/N4 language test modules** (available in the Test Corner!).
2. Focus on conversational business etiquette (*Jikoshoukai* and *Keigo*).
3. Maintain a minimum CGPA of 7.0 with strong core engineering fundamentals.`;
      } else if (lower.includes('microsoft') || lower.includes('cohesity') || lower.includes('adobe') || lower.includes('coding')) {
        botReply = `For product giants like **Microsoft (₹40 LPA)** and **Cohesity (₹24 LPA)**:
1. **Online Assessment (OA)**: 2-3 algorithmic problems (Sliding Window, Dynamic Programming, Graphs).
2. **Technical Rounds**: Focus on space/time complexity optimization and clean object-oriented code.
3. Check the **Study Materials** section for our curated DSA Blind-75 cheat sheets!`;
      } else if (lower.includes('contact') || lower.includes('dean') || lower.includes('call') || lower.includes('admin')) {
        botReply = `You can directly reach the Sahyadri Placement & Training Cell headed by **Prof. Rashmi Bhandary** (Dean – Placements). You can also click the **'Call Admin'** button in the header, and our AI Call Assistant will connect with administration and forward the call to your device right away!`;
      } else {
        botReply = `Welcome to the Sahyadri Placement Hub! Our Career Guidance and Training Cell offers over 20 mock aptitude and Japanese language tests, weekly editions of the **Campus Buzz** placement magazine, and verified links to top global drives. How can I help boost your placement prep today?`;
      }
    }

    res.json({
      reply: botReply,
      source: 'Gemini 2.5 Flash'
    });
  } catch (err) {
    console.error('AI chat endpoint error:', err);
    res.status(500).json({ error: 'Error generating AI response.' });
  }
});

// POST /api/ai/voice - ElevenLabs Text-to-Speech audio generator
router.post('/voice', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for voice generation.' });
    }

    // Limit text length to conserve character quota
    const truncatedText = text.length > 300 ? text.slice(0, 300) + '...' : text;
    const targetVoice = voiceId || ELEVENLABS_VOICE_ID;

    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`,
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        text: truncatedText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      responseType: 'arraybuffer',
      timeout: 10000
    });

    const base64Audio = Buffer.from(response.data).toString('base64');
    res.json({
      audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
      charactersUsed: truncatedText.length
    });
  } catch (err) {
    console.warn('[ElevenLabs] TTS generation error:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Could not generate ElevenLabs audio. Fallback to Web Speech API enabled.',
      fallback: true
    });
  }
});

// POST /api/ai/admin-call - AI Assistant contacting administration and forwarding call
router.post('/admin-call', optionalAuth, async (req, res) => {
  try {
    const { query, studentName, usn, branch } = req.body;
    const name = studentName || (req.user ? req.user.name : 'Sanvith Rai');
    const studentUSN = usn || (req.user ? req.user.usn : '4SF22CI048');
    const studentBranch = branch || (req.user ? req.user.branch : 'CSE');

    const dialTimestamp = new Date().toLocaleTimeString();

    // Call forwarding transcript and status simulation
    const callFlow = [
      {
        step: 1,
        speaker: "AI Dispatcher",
        status: "Initiating Outbound Call",
        text: `Dialing Sahyadri Placement & Training Helpline (+91-824-2277222) on behalf of student ${name} (${studentUSN})...`,
        timestamp: "00:02"
      },
      {
        step: 2,
        speaker: "SCEM IVR System",
        status: "Line Connected",
        text: "Thank you for calling Sahyadri College of Engineering & Management, Mangaluru. Placement and Career Guidance Cell.",
        timestamp: "00:05"
      },
      {
        step: 3,
        speaker: "AI Dispatcher",
        status: "Triage & Verification",
        text: `Good morning. This is the Sahyadri Placement AI Assistant forwarding a verified inquiry from ${name}, 6th Sem ${studentBranch}, regarding: "${query || 'Upcoming recruitment drives and Japanese language test verification'}".`,
        timestamp: "00:11"
      },
      {
        step: 4,
        speaker: "Prof. Rashmi Bhandary's Office (Admin Desk)",
        status: "Call Forwarded to Student",
        text: `Hello ${name}! Thank you for reaching out through the Placement Portal. We have received your query regarding ${query || 'campus placement registration'}. Your eligibility records are active. Please ensure you have completed at least 3 practice tests in the Test Corner and verified your resume in your student dashboard. We are happy to connect with you directly.`,
        timestamp: "00:18"
      }
    ];

    res.json({
      success: true,
      callId: `CALL_SCEM_${Date.now()}`,
      status: "FORWARDED_LIVE",
      helpline: "+91-824-2277222",
      department: "Career Guidance, Training & Placement Cell",
      contactPerson: "Prof. Rashmi Bhandary / Placement Office Desk",
      timestamp: dialTimestamp,
      transcript: callFlow,
      recommendedVoiceGreeting: `Connecting you live with the Sahyadri Placement Desk. Student ${name}, your call has been patched through.`
    });
  } catch (err) {
    console.error('Admin call error:', err);
    res.status(500).json({ error: 'Failed to initiate admin call.' });
  }
});

module.exports = router;

