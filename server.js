import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// --- ඔයා දුන්න Gemini Function එක (පොඩ්ඩක් පිළිවෙල කලා) ---
async function gemini(query, options = {}) {
    const { session } = options;
    
    // Base64 ලින්ක් එක decode කිරීම
    const superSecretEncodedApiEndpoint = "aHR0cHM6Ly9keHotYWkudmVyY2VsLmFwcC9hcGkvZ2VtaW5p";
    const finalApiUrl = Buffer.from(superSecretEncodedApiEndpoint, 'base64').toString('utf8');

    const requestParameters = { text: query };
    if (session) requestParameters.session = session;

    const requestHeaders = {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Postify/1.0.0",
    };

    try {
        const axiosResponse = await axios.get(finalApiUrl, {
            params: requestParameters,
            headers: requestHeaders,
            timeout: 30000,
        });

        const responseBody = axiosResponse.data;
        return {
            status: true,
            ok: responseBody.ok ?? false,
            message: (responseBody.message || "").trim(),
            creator: responseBody.creator || "Chamod Nimsara",
            session: responseBody.session || undefined,
        };
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
}

// --- API Endpoint එක ---
// පාවිච්චි කරන විදිහ: /api/chat?query=hello&session=ID_එක
app.get('/api/chat', async (req, res) => {
    const { query, session } = req.query;

    if (!query) {
        return res.status(400).json({ status: false, error: "Query එකක් ඇතුලත් කරන්න." });
    }

    try {
        const result = await gemini(query, { session });
        res.json(result);
    } catch (err) {
        res.status(500).json({ 
            status: false, 
            error: "API එක ක්‍රියා විරහිතයි.", 
            details: err.message 
        });
    }
});

// Vercel සඳහා Export කිරීම හෝ Local එකේ Run කිරීම
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
