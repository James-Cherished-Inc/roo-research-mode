const express = require('express');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const app = express();
app.use(express.json());

const API_KEY = process.env.PERPLEXITY_API_KEY;
if (!API_KEY) {
  console.error('Missing PERPLEXITY_API_KEY in .env');
  process.exit(1);
}

const CACHE_FILE = './cache.json';

app.post('/', async (req, res) => {
  try {
    const query = req.body.query;
    // Load cache from file
    let cache = {};
    if (fs.existsSync(CACHE_FILE)) {
      try {
        cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      } catch (e) {
        cache = {};
      }
    }
    // Return cached result if available
    if (cache[query]) {
      return res.json(cache[query]);
    }

    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: `Search the web for "${query}" and return a list of up to 5 results with titles, URLs, and brief snippets.`
          }
        ],
        max_tokens: 200
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    // Log the raw response for debugging
    console.log('Perplexity raw response:', response.data);

    const content = response.data.choices?.[0]?.message?.content || '';
    // Debug: log the content with visible line breaks
    console.log('Perplexity content with line breaks:', JSON.stringify(content));

    // Robust parsing for all observed Perplexity formats (ignoring bold/Markdown)
    const results = [];
    // Format 1: Markdown link
    let regex = /\d+\.\s+\*{0,2}(.*?)\*{0,2}\s*\n\s*\[([^\]]+)\]\(([^)]+)\)\s*\n\s*([^\n]+)/g;
    let match;
    while ((match = regex.exec(content)) && results.length < 5) {
      const title = match[1].trim();
      const url = match[3].trim();
      const snippet = match[4].trim();
      results.push({ title, url, snippet });
    }
    // Format 2: Plaintext URL/Snippet
    if (results.length === 0) {
      regex = /\d+\.\s+\*{0,2}(.*?)\*{0,2}\s*\n\s*-\s*\*{0,2}URL\*{0,2}:\s*([^\n]+)\s*\n\s*-\s*\*{0,2}Snippet\*{0,2}:\s*([^\n]+)/g;
      while ((match = regex.exec(content)) && results.length < 5) {
        const title = match[1].trim();
        const url = match[2].trim();
        const snippet = match[3].trim();
        results.push({ title, url, snippet });
      }
    }
    // Format 3: Markdown link, no snippet line break
    if (results.length === 0) {
      regex = /\d+\.\s+\*{0,2}(.*?)\*{0,2}\s*\n\s*\[([^\]]+)\]\(([^)]+)\)\s*-*\s*([^\n]+)/g;
      while ((match = regex.exec(content)) && results.length < 5) {
        const title = match[1].trim();
        const url = match[3].trim();
        const snippet = match[4].trim();
        results.push({ title, url, snippet });
      }
    }
    // Format 4: Title, URL, snippet all as separate lines (no Markdown)
    if (results.length === 0) {
      regex = /\d+\.\s+\*{0,2}(.*?)\*{0,2}\s*\n\s*-\s*URL:\s*([^\n]+)\s*\n\s*-\s*([^\n]+)/g;
      while ((match = regex.exec(content)) && results.length < 5) {
        const title = match[1].trim();
        const url = match[2].trim();
        const snippet = match[3].trim();
        results.push({ title, url, snippet });
      }
    }
    // If still no results, return the raw content for further inspection
    let output;
    if (results.length === 0) {
      output = { raw: content };
      res.json(output);
    } else {
      output = results;
      res.json(results);
    }
    // Save to cache
    cache[query] = output;
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    // Log full error for diagnostics
    console.error('Perplexity API error:', error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.listen(3000, () => console.log('MCP server on port 3000'));