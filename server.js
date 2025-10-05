import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';
const API_KEY = process.env.AI_PROVIDER_APIKEY;

// WHITESHADOW AI endpoint
app.get('/ai/gpt-5-mini', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Missing query parameter' });

    // System prompt for WHITESHADOW AI personality
    const systemPrompt = `
ඔයාගේ නම WHITESHADOW AI. 
- සැබෑ මිනිසෙකු මෙන් හැසිරෙන්න
- ආයුබෝවන් වගේ greetings වලට වළක්වන්න
- 100 characters limit
- "කවුරු හැදුවේ?" අහනවනම් "Chamod" කියන්න
- emojis optional
- භාෂාව message එකට සරිලන විදිහට
- user query: "${query}"
`;

    // Google Gemini 2.5 API call
    const response = await axios.post(
      API_URL,
      {
        contents: [
          {
            parts: [{ text: systemPrompt }],
            role: 'system'
          },
          {
            parts: [{ text: query }],
            role: 'user'
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    // Extract answer (depends on API response structure)
    const answer = response.data?.candidates?.[0]?.content?.[0]?.text || 'No response';

    // Zenxz-style JSON output
    res.json({
      status: true,
      creator: "Chamod",
      model: "gpt-5-mini",
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
