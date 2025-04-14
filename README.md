# Roo Code ResearchMode with Perplexity & Lynx

This repository contains the code for a custom Roo Code mode ("ResearchMode") that integrates Perplexity API for web search and Lynx for page analysis, enabling research-augmented software engineering within the Roo Code VS Code extension.

## Features

*   **Perplexity Integration:** Uses the Perplexity API (via a local MCP server) for high-quality, up-to-date web search results using the `sonar` model.
*   **Lynx Integration:** Leverages the Lynx text-based browser for deep page analysis, code extraction, and documentation summarization directly within Roo Code.
*   **Research-Augmented Coding:** Designed for software engineers to seamlessly blend coding tasks with research, using findings to inform code generation, refactoring, and technical decisions.
*   **Caching:** Includes simple file-based caching (`cache.json`) for Perplexity results to conserve API credits and improve response times.
*   **Configurable:** Uses a `.env` file for secure API key management.
*   **Automatic Server Management:** Designed for Roo Code to automatically start and manage the local MCP server once configured.

## Prerequisites

Before you begin, ensure you have the following installed and configured:

1.  **Roo Code:** The [Roo Code VS Code extension](https://marketplace.visualstudio.com/items?itemName=rooveterinaryinc.roo-cline) must be installed.
2.  **Node.js & npm:**
    *   Node.js (v14 or higher is recommended). You can download it from [nodejs.org](https://nodejs.org/).
    *   npm (Node Package Manager) is usually included with Node.js. Verify installation by running `node -v` and `npm -v` in your terminal.
    *   If needed, install on Debian/Ubuntu: `sudo apt update && sudo apt install nodejs npm -y`
3.  **Lynx:**
    *   The Lynx text-based web browser is required for page analysis.
    *   Install on Debian/Ubuntu: `sudo apt update && sudo apt install lynx -y`
    *   Verify installation by running `lynx --version`.
4.  **Perplexity Account & API Key:**
    *   You need a Perplexity account (Pro recommended for higher limits).
    *   Obtain an API key from your Perplexity account settings page: [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api). Generate a new key if you don't have one.

## Setup & Configuration

Follow these steps carefully to enable automatic server management by Roo Code:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/James-Cherished/rooresearcher.git # Or your fork's URL
    cd rooresearcher
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Configure API Key:**
    *   Create a `.env` file: `cp .env.example .env`
    *   Edit `.env` and add your Perplexity API key:
        ```dotenv
        PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxx
        ```
    *   The `.gitignore` file prevents committing your `.env` file.

4.  **One-Time Roo Code Configuration (User Action Required):**
    This step tells Roo Code how to find and automatically start the server. You need to edit two Roo Code configuration files **manually**.

    *   **Find Your Configuration Files:**
        *   On Linux: `~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/`
        *   On macOS: `~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/`
        *   On Windows: `%APPDATA%\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\`
    *   **Configure the MCP Server (`mcp_settings.json`):**
        *   Open `mcp_settings.json` in the settings directory.
        *   Add the following entry inside the `"mcpServers": { ... }` object.
        *   **CRITICAL:** Replace `/path/to/your/rooresearcher/index.js` with the **full, absolute path** to the `index.js` file in the directory where you cloned this repository.
            ```json
            // Inside mcp_settings.json
            "perplexity-search": {
              "command": "node",
              // IMPORTANT: Use the correct absolute path to index.js here!
              "args": ["/path/to/your/rooresearcher/index.js"],
              "env": {} // API key is handled by .env in the server directory
            }
            ```
            *(If the file or `mcpServers` object doesn't exist, create them)*
    *   **Configure the Custom Mode (`custom_modes.json`):**
        *   Open `custom_modes.json` in the settings directory.
        *   Add the following mode definition inside the `"customModes": [ ... ]` array.
            ```json
            // Inside custom_modes.json (within the array)
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
              "source": "global" // Or set to "workspace" if preferred
            }
            ```
            *(If the file or `customModes` array doesn't exist, create them)*

5.  **Restart VS Code:** After saving changes to **both** configuration files, **restart VS Code completely**. Roo Code will now detect the configuration and attempt to start the `perplexity-search` MCP server automatically.

## Running the MCP Server

*   **Automatic Startup (Intended):** After completing the one-time Roo Code configuration and restarting VS Code, the Perplexity MCP server should start automatically in the background, managed by Roo Code. You shouldn't need to do anything else.
*   **Troubleshooting / Manual Fallback:** If the server doesn't seem to be working (e.g., research commands fail in ResearchMode), you can try running it manually for testing or as a temporary workaround:
    1.  Open a terminal.
    2.  Navigate to the repository directory: `cd /path/to/your/rooresearcher`
    3.  Start the server: `node index.js`
    4.  The terminal will show `MCP server on port 3000`. Keep this terminal running while using ResearchMode.
    *If manual startup works but automatic doesn't, double-check the absolute path configured in `mcp_settings.json`.*
*   **Persistent Background Execution (Advanced):** If you prefer not to rely on Roo Code's management or want the server always running, consider using process managers like `pm2` (`npm install pm2 -g`, then `pm2 start index.js --name perplexity-mcp`) or configuring it as a `systemd` service (Linux).

## Usage

Once set up and the MCP server is running (ideally automatically), activate "ResearchMode" in Roo Code. You can now perform tasks like:

*   **Code with Research:** "Refactor this Python function to use async/await. Search for best practices first."
*   **Targeted Research:** "Find examples of Rust's `Result` type used with file I/O."
*   **Documentation Analysis:** "Summarize the main points of the Lynx man page using `lynx -dump 'man:lynx'`."
*   **Code Extraction:** "Search for a JavaScript debounce function example and extract the code from the top result."
*   **Iterative Development:** Roo will use research findings to suggest code, which you can then refine together. Roo is also instructed to document the influence of research in comments or docs.

## Cost Estimation

Perplexity API usage incurs costs based on tokens processed. Based on the development and testing for *this specific setup task*, the estimated cost was approximately **$0.05**. Actual costs will vary significantly depending on the complexity and frequency of your queries. The caching mechanism helps mitigate costs for repeated searches. Monitor your usage via the Perplexity dashboard.

## License

This project is licensed under the **Mozilla Public License 2.0 (MPL 2.0)**. See the `LICENSE` file for details.