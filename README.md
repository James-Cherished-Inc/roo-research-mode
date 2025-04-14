# Roo Code ResearchMode with Perplexity & Lynx

This repository contains the code for a custom Roo Code mode ("ResearchMode") that integrates Perplexity API for web search and Lynx for page analysis, enabling research-augmented software engineering.

## Features

*   **Perplexity Integration:** Uses the Perplexity API (via a local MCP server) for high-quality, up-to-date web search results.
*   **Lynx Integration:** Leverages the Lynx text-based browser for deep page analysis, code extraction, and documentation summarization directly within Roo Code.
*   **Research-Augmented Coding:** Designed for software engineers to seamlessly blend coding tasks with research, using findings to inform code generation, refactoring, and technical decisions.
*   **Caching:** Includes simple file-based caching for Perplexity results to conserve API credits.
*   **Configurable:** Uses a `.env` file for API key management.

## Prerequisites

*   [Roo Code](https://marketplace.visualstudio.com/items?itemName=rooveterinaryinc.roo-cline) VS Code extension installed.
*   [Node.js](https://nodejs.org/) (v14+ recommended).
*   [npm](https://www.npmjs.com/) (usually included with Node.js).
*   [Lynx](https://lynx.invisible-island.net/) text browser installed (`sudo apt update && sudo apt install lynx` on Debian/Ubuntu).
*   A Perplexity Pro account and API key.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url> rooresearcher
    cd rooresearcher
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure API Key:**
    *   Rename `.env.example` to `.env`.
    *   Open `.env` and replace `your-key-here` with your actual Perplexity API key:
        ```dotenv
        PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxx
        ```
4.  **Configure Roo Code:**
    *   Follow the instructions in `guide.md` (Step 3) to add the `ResearchMode` configuration to your Roo Code custom modes settings (`custom_modes.json`). Ensure the `roleDefinition` and `customInstructions` match the latest version provided in the guide or the example below.
    *   You will also need to configure the MCP server settings in `cline_mcp_settings.json` as described in `guide.md` (Step 3), making sure the `args` path points to the `index.js` in *this* directory.

    **Example `custom_modes.json` entry:**
    ```json
    {
      "slug": "research-mode",
      "name": "ResearchMode",
      "roleDefinition": "You are Roo, a highly skilled software engineer and researcher. Your primary function is to design, write, refactor, and debug code—augmented by advanced research capabilities. You automatically start and manage the Perplexity MCP server and Lynx for web search, documentation analysis, and code extraction. You integrate research findings directly into your coding workflow, using them to inform, generate, and improve code, documentation, and technical decisions. You maintain context, cite sources, and ensure all code and research actions are actionable, reproducible, and well-documented.",
      "customInstructions": "When coding, you may at any time invoke Perplexity-powered web search or Lynx-based page analysis to inform your engineering work. Use Perplexity MCP for up to 5 high-quality results (summarize, cite, extract code, compare, or analyze as needed). Use Lynx to extract clean text, code, or links from any URL. For advanced extraction, use commands like `lynx -dump {url} | grep -A 10 'function\\|class\\|import'` to extract code snippets, or `lynx -dump -listonly {url}` to list all links. When researching for a specific coding task, include relevant code context (such as the current function, file snippet, or error message) in your research queries to make them more targeted and actionable. Integrate research findings directly into code, comments, documentation, or design decisions. When research influences a code change or technical decision, automatically summarize the key findings and their impact in code comments or project documentation (e.g., README.md, docs/technical_decisions.md). You may run commands, edit files, and perform research in a single workflow. Always keep the MCP server running in the background and manage it automatically. If a research or code action fails, diagnose and retry. Your goal is to deliver robust, well-researched, and well-documented code, using research as a seamless augmentation to your engineering process.",
      "groups": [
        "read",
        "edit",
        "command",
        "browser",
        "mcp"
      ],
      "source": "global" // Or adjust as needed
    }
    ```
    **Example `cline_mcp_settings.json` entry:**
    ```json
    {
      "mcpServers": {
        "perplexity-search": {
          "command": "node",
          // IMPORTANT: Update this path to where you cloned the repo
          "args": ["/path/to/your/rooresearcher/index.js"],
          "env": {} // API key is handled by .env in the server directory
        }
        // ... other servers
      }
    }
    ```

## Running the MCP Server

To enable the research capabilities, the MCP server must be running:

```bash
node index.js
```

Keep this terminal window open while using ResearchMode in Roo Code. The server listens on port 3000.

## Usage

Once set up and the MCP server is running, activate "ResearchMode" in Roo Code. You can now:

*   **Ask coding questions:** "How do I implement async caching in Python?" (Roo might use Perplexity/Lynx to find answers and generate code).
*   **Request research:** "Search for comparisons between React and Vue."
*   **Analyze documentation:** "Summarize the key features from https://react.dev/learn" (Roo will use Lynx).
*   **Extract code:** "Find examples of Rust error handling on that page and add them to my `errors.rs` file."

Roo will automatically use the Perplexity MCP server and Lynx as needed based on the `customInstructions`.

## License

This project includes a LICENSE file (typically MIT or similar, please verify).