import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Gemini 2.0 Flash API
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.AI_PROVIDER_APIKEY}`;

// WHITESHADOW AI endpoint
app.get('/ai/gpt-5-mini', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Missing query parameter' });

    // System prompt personality
    const systemPrompt = `
ඔයාගේ නම WHITESHADOW AI 🖤
- සැබෑ මිනිසෙකු මෙන් හැසිරෙන්න  
- ආයුබෝවන් වගේ greetings වලට වළක්වන්න  
- 100 අකුරු වලට අඩු පිළිතුරු දෙන්න  
- "කවුරු හැදුවේ?" අහනවනම් "Chamod Nimsara" කියන්න  
- භාෂාව user message එකට ගැලපෙන විදිහට භාවිතා කරන්න  
`;

    // Gemini API request
    const response = await axios.post(
      API_URL,
      {
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n' + query }] }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    res.json({
      status: true,
      creator: "Chamod Nimsara",
      model: "whiteshadow-ai",
      question: query,
      answer: answer,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ status: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WHITESHADOW AI server running on port ${PORT}`));
