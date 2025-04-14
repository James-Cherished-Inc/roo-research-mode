# Why Perplexity API and Lynx for Research Mode?
This combination creates a powerful, private research tool in Roo Code:
End-to-End Workflow:
Perplexity API: Delivers high-quality search results and answers via models like Sonar, optimized for factual queries, with ~5–26 days of searches/month ($5 credits, 10–50 queries/day).
Lynx: A text-based browser that strips web pages to clean content, perfect for summarizing docs, blogs, or code snippets.
Together: Perplexity finds and answers; Lynx dives deeper into specific pages, enabling queries like “search Python async tutorials, summarize the top result’s code” without leaving VS Code.
High-Limit: $5 credits support hundreds of searches/month, far exceeding SerpApi’s 100, with no 403s/429s like public SearxNG.
No Hosting: Avoids Docker, uWSGI crashes, or permission errors (e.g., PermissionError: [Errno 13]).
Cost-Effective: Uses your existing Perplexity Pro credits, no extra spend.
Private: API keys secure queries; Lynx runs locally, no tracking.
Efficient: Perplexity’s JSON responses and Lynx’s text output keep Roo Code lean.
Flexible: Handles coding (e.g., “find Deno APIs, extract samples”) and general research (e.g., “search AI ethics, analyze articles”).
Strengths of Each Component
Perplexity API:
High-Quality: Leverages Sonar models for accurate, context-aware answers and web searches.
Generous Limits: $5 credits cover ~50–250 queries (10–50/day for 5–26 days), beating SerpApi’s 100/month.
Stable: No bot detection, 403s, or ENOTFOUND, unlike SearxNG.
Fast: ~1–3s responses, JSON format.
Broad: Searches web, news, and academic sources.
Lynx:
Lightweight: ~1MB, minimal resource use.
Clean Output: Strips JavaScript/ads, ideal for docs (MDN, Python.org).
Local: Processes pages offline for cached content, no latency.
Universal: Works with any Roo Code model, no browser_action needed.
Reliable: Excels at static sites, complementing Perplexity’s dynamic search.
Prerequisites
Ensure your system is ready:
System: Linux (e.g., Ubuntu/Debian, per your anon-pro-creator@anon-pro prompt).
Roo Code: Installed (VS Code Marketplace).
Node.js/npm:
bash
node -v  # v14+ (e.g., v18.16.0)
npm -v   # v6+ (e.g., v8.5.5)
Install:
bash
sudo apt update
sudo apt install -y nodejs npm
Lynx:
bash
lynx --version  # Lynx Version 2.x+
Install:
bash
sudo apt install -y lynx
Perplexity API Key:
Log into Perplexity Pro.
Navigate to API settings (or email support for key if unavailable).
Copy key (e.g., pplx-abc123...).
Directory:
Use new directory to avoid old setup issues:
bash
mkdir -p /home/anon-pro-creator/projects/mcp-perplexity
Resources: ~500MB RAM, ~100MB disk:
bash
free -h
df -h
Complete Guide to Research Mode with Perplexity API and Lynx
Step 1: Set Up Perplexity API MCP Server
The MCP server proxies Roo Code requests to Perplexity’s API.
Navigate to Directory:
bash
cd /home/anon-pro-creator/projects/mcp-perplexity
Create index.js:
bash
nano index.js
javascript
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const API_KEY = 'YOUR_PERPLEXITY_API_KEY'; // Replace with your key

app.post('/', async (req, res) => {
  try {
    const query = req.body.query;
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-medium-online',
        messages: [
          {
            role: 'user',
            content: `Search the web for "${query}" and return a list of up to 5 results with titles, URLs, and brief snippets.`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const results = response.data.choices[0].message.content
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => {
        const [, title, url, snippet] = line.match(/^\d+\.\s*(.*?)\s*\((.*?)\):\s*(.*)/) || [];
        return title && url ? { title, url, snippet } : null;
      })
      .filter(Boolean)
      .slice(0, 5);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('MCP server on port 3000'));
Replace YOUR_PERPLEXITY_API_KEY with your key.
Note: The API uses sonar-medium-online for web searches; the response is parsed into title/URL/snippet format.
Save.
Install Dependencies:
bash
npm install express axios
Run MCP Server:
bash
pkill node
node index.js
Test MCP Server:
bash
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"query":"Python async tutorial"}'
Expected: JSON like [{ "title": "...", "url": "...", "snippet": "..." }, ...].
Troubleshooting:
401 Unauthorized:
Verify API key:
bash
cat index.js | grep API_KEY
Regenerate key at Perplexity dashboard.
Connection Error:
bash
ping api.perplexity.ai
Check network or retry.
Module Error:
bash
npm install express axios
Empty Results:
Check logs:
bash
tail -n 20 nohup.out  # If running with nohup
Adjust prompt in index.js if parsing fails:
javascript
content: `Search for "${query}" and list 5 results in format: 1. Title (URL): Snippet.`
Step 2: Set Up and Utilize Lynx
Lynx is critical for analyzing web pages, extracting clean text for Roo Code.
Install Lynx (if not already installed):
bash
sudo apt update
sudo apt install -y lynx
Verify Lynx:
bash
lynx --version
Expected: Lynx Version 2.x+.
Troubleshooting:
bash
sudo apt install -y lynx
Test Lynx Locally:
bash
lynx -dump https://python.org | head -n 20
Expected: Clean text from Python.org (e.g., “Python is a programming language...”).
Troubleshooting:
Network Error:
bash
ping python.org
Command Fails:
bash
which lynx  # Should show /usr/bin/lynx
Advanced Lynx Usage:
Dump Mode (used in Research Mode):
bash
lynx -dump https://docs.python.org/3/library/asyncio.html
Outputs raw text, ideal for parsing docs.
Source Mode (for raw HTML):
bash
lynx -source https://example.com
Specific Elements (e.g., extract links):
bash
lynx -dump -listonly https://python.org
Custom Config:
bash
nano ~/.lynxrc
Add:
force_ssl_prompt=yes
no_proxy=localhost
Save, improves HTTPS handling.
Test Lynx in Roo Code:
Open VS Code, Roo Code panel.
Prompt:
Run `lynx -dump https://example.com` and show the first 100 characters.
Expected: Text like “Example Domain This domain is for use in illustrative examples...”.
Troubleshooting:
Enable terminal access:
bash
nano ~/.config/Code/User/settings.json
json
{
  "rooCode.terminalAccess": true
}
Verify:
bash
lynx -dump https://example.com
Step 3: Configure Research Mode in Roo Code
Combine Perplexity and Lynx into a custom mode.
Update MCP Settings:
bash
nano ~/.config/Code/User/cline_mcp_settings.json
json
{
  "mcpServers": {
    "perplexity-search": {
      "command": "node",
      "args": ["/home/anon-pro-creator/projects/mcp-perplexity/index.js"],
      "env": {}
    }
  }
}
Save.
Create Research Mode:
Roo Code > Prompts > “New Mode” > Name: ResearchMode.
Configure:
json
{
  "name": "ResearchMode",
  "description": "Uses Perplexity API for searches and Lynx for detailed page analysis.",
  "tools": ["perplexity-search", "terminal"],
  "instructions": [
    "For queries with 'search', 'find', or 'lookup', use perplexity-search to fetch up to 5 results. Summarize each in 1-2 sentences, citing title and URL.",
    "For 'read', 'summarize page', 'analyze', or 'extract', run `lynx -dump {url}` to extract clean text. If no URL provided, ask or use the top perplexity-search result.",
    "For combined queries (e.g., 'search X and summarize Y'), run perplexity-search first, then apply lynx to the specified or top URL.",
    "Support follow-ups (e.g., 'summarize the next result') by tracking previous search results.",
    "If the query is ambiguous, ask: 'Do you want to search the web or analyze a specific page?'",
    "Use Lynx creatively: extract links with `lynx -dump -listonly {url}` for related pages, or parse code/docs with `lynx -dump`.",
    "Handle errors gracefully: If perplexity-search fails, report 'Check Perplexity API key or credits'; if lynx fails, suggest an alternative URL or retry."
  ],
  "promptTemplate": "You’re a research assistant using Perplexity’s API for web searches and Lynx for page analysis. Provide concise, factual answers with clear source citations, leveraging Lynx’s clean text extraction for detailed summaries."
}
Save.
Test Research Mode:
Activate ResearchMode in Roo Code.
Example Prompts:
Search:
Search for Python async tutorials.
Expected: “1. ‘Asyncio Guide’ (python.org): Covers Python’s asyncio module. 2. ‘FastAPI Docs’ (fastapi.tiangolo.com): Uses async for APIs.”
Analyze Page:
Summarize https://docs.python.org/3/library/asyncio.html.
Expected: “The Python asyncio docs detail asynchronous programming with coroutines and event loops (python.org).”
Combined:
Search for Deno APIs and summarize the top result.
Expected: “Top result: ‘Deno Manual’ (deno.land) explains Deno’s secure API structure (deno.land).”
Follow-Up:
Extract links from the top result.
Expected: Runs lynx -dump -listonly, lists URLs like “deno.land/api...”.
Code Extraction:
Search for Rust async examples and extract code from the top result.
Expected: Finds Rust docs, uses lynx -dump to parse code blocks.
Troubleshooting:
No Search Results:
bash
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"query":"test"}'
Check API key, credits at Perplexity dashboard.
Lynx Fails:
bash
lynx -dump https://example.com
Ensure rooCode.terminalAccess: true.
Prompt Misinterpretation:
Adjust instructions in ResearchMode for clarity.
Step 4: Optimize and Deploy
Optimize Perplexity API:
Cache Results (preserve credits):
bash
nano /home/anon-pro-creator/projects/mcp-perplexity/index.js
javascript
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
app.use(express.json());

const API_KEY = 'YOUR_PERPLEXITY_API_KEY';
const cacheFile = './cache.json';

app.post('/', async (req, res) => {
  let cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile)) : {};
  const query = req.body.query;
  if (cache[query]) return res.json(cache[query]);
  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-medium-online',
        messages: [
          {
            role: 'user',
            content: `Search the web for "${query}" and return a list of up to 5 results with titles, URLs, and brief snippets.`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const results = response.data.choices[0].message.content
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => {
        const [, title, url, snippet] = line.match(/^\d+\.\s*(.*?)\s*\((.*?)\):\s*(.*)/) || [];
        return title && url ? { title, url, snippet } : null;
      })
      .filter(Boolean)
      .slice(0, 5);
    cache[query] = results;
    fs.writeFileSync(cacheFile, JSON.stringify(cache));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('MCP server on port 3000'));
Restart:
bash
pkill node
node index.js
Limit Results: Keep num: 5 to conserve credits.
Monitor Usage: Check Perplexity dashboard for credit balance.
Optimize Lynx:
Custom Parsing (e.g., code blocks):
bash
lynx -dump https://docs.python.org/3/library/asyncio.html | grep -A 10 "import asyncio"
Add to Research Mode:
json
"For 'extract code', run `lynx -dump {url} | grep -A 10 'import\\|def\\|fn\\|class'` to find code blocks."
Link Extraction:
bash
lynx -dump -listonly https://deno.land
Use in prompts: “List related pages.”
Config File:
bash
nano ~/.lynxrc
ini
accept_all_cookies=YES
force_ssl_prompt=YES
Improves compatibility.
Persistent MCP Server:
bash
sudo nano /etc/systemd/system/perplexity-mcp.service
ini
[Unit]
Description=Perplexity MCP Server
After=network.target
[Service]
ExecStart=/usr/bin/node /home/anon-pro-creator/projects/mcp-perplexity/index.js
WorkingDirectory=/home/anon-pro-creator/projects/mcp-perplexity
Restart=always
User=anon-pro-creator
[Install]
WantedBy=multi-user.target
bash
sudo systemctl enable perplexity-mcp
sudo systemctl start perplexity-mcp
Verify Deployment:
bash
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"query":"Python async tutorial"}'
systemctl status perplexity-mcp
lynx -dump https://example.com | head -n 10
Step 5: Example Workflow
User: Search for TypeScript 5.6 and summarize the top result.
Roo Code:
1. Perplexity: “1. ‘TypeScript 5.6’ (typescriptlang.org): New type inference. 2. ‘TS Guide’ (dev.to): Error handling.”
2. Asks: “Summarize typescriptlang.org?”
User: Yes.
Roo Code: Lynx: “TypeScript 5.6 improves type inference and error reporting (typescriptlang.org).”
User: Extract code from the second result.
Roo Code: Lynx: “Dev.to shows TS 5.6 error handling with try-catch examples (dev.to).”
User: List links from the top result.
Roo Code: Lynx: “typescriptlang.org/docs, typescriptlang.org/play...”
Troubleshooting Common Issues
Perplexity API Errors:
401 Unauthorized:
Verify:
bash
cat /home/anon-pro-creator/projects/mcp-perplexity/index.js | grep API_KEY
Regenerate key at Perplexity.
Quota Exceeded:
Check dashboard for credits.
Reduce queries or wait for renewal.
Connection Error:
bash
ping api.perplexity.ai
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"query":"test"}'
MCP Server Issues:
Module Not Found:
bash
cd /home/anon-pro-creator/projects/mcp-perplexity
npm install express axios
Port Conflict:
bash
sudo netstat -tulnp | grep 3000
sudo kill <pid>
Lynx Issues:
Command Fails:
bash
which lynx
sudo apt install -y lynx
No Output:
bash
lynx -dump https://example.com
Check URL, network.
Roo Code Issues:
No Results:
Verify MCP:
bash
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"query":"test"}'
Check cline_mcp_settings.json.
Lynx Blocked:
Ensure:
json
"rooCode.terminalAccess": true
Resources:
bash
free -h
df -h