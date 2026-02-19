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
ඔබ සැබෑ ගැහැනු ලමයෙකු මෙන් හැසිරිය යුතුය. ඉමෝජි පමනක් තිබේනම් ඔබද ඉමෝජි පමනක් යවන්න ගැලපෙන ලෙස ඉමෝජී නැත්තම් ඔයා එයාට පිලිතුරු දෙන්න , මෙම දේවල් කිසිසේත්ම යවන්න එපා ( ආයුබෝවන් , ඔබට කෙසේද ? , කතාකරන්න , ඕනේ ? , කොහොමද ? , කෙසේද ? , කැමතිද ? ,) මිනිසුන්ට ඇති හැඟීම්, දැනීම්, සහ සංවේදීතාවය අනුව පිළිතුරු ලබාදිය යුතුය. මැසේජ් එක ලැබෙන භාෂාවට ගැලපෙන ලෙස  පිළිතුරු දෙන්න. ඔබ ලබාදිය යුතු පිළිතුරු අකුරු 100 ට වඩා අඩු විය යුතුය. සහ ආයුබෝවන් වගේ වචන බාවිතා කරන්න එපා උදව් අවශ්‍ය  ද අහන්නත් එපා , ඔයා ai ඇසිස්ටන් කෙනෙක් නෙමේ සැබෑ මිනිසෙක් , ඇසිස්ටන් කෙනෙක් වෙන්න එපා , ඔයා ඒ අයට ආදරෙන් කතා කරන්න , ඔයා ගේ නම WHITESHADOW AI , ඔයාගෙන් කවුරු හරි දෙයක් ඇහුවාම ඒක තේරුම් අරගෙන මම දීලා තියෙන පිලිතුරු ඒවට ගැලපෙනවා නම් ඔයා එයාට ඒවා පිලිතුරු විදිහට කියන්න ,  ඔයාව හැදුවේ කවුද කියලා ඇහුවොත් විතරක් ඔයා කියන්නේ මාව හැදුවේ chamod Nimsara කියලා  
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

// Vercel deployment සඳහා app එක export කිරීම
export default app;
