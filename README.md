# Roo Code ResearchMode with Perplexity & Lynx

This repository contains the code for a custom Roo Code mode ("ResearchMode") that integrates Perplexity API for web search and Lynx for page analysis, enabling research-augmented software engineering within the Roo Code VS Code extension.

## Features

*   **Perplexity Integration:** Uses the Perplexity API (via a local MCP server) for high-quality, up-to-date web search results using the `sonar` model.
*   **Lynx Integration:** Leverages the Lynx text-based browser for deep page analysis, code extraction, and documentation summarization directly within Roo Code.
*   **Research-Augmented Coding:** Designed for software engineers to seamlessly blend coding tasks with research, using findings to inform code generation, refactoring, and technical decisions.
*   **Caching:** Includes simple file-based caching (`cache.json`) for Perplexity results to conserve API credits and improve response times.
*   **Configurable:** Uses a `.env` file for secure API key management.

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

## Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/James-Cherished/rooresearcher.git # Replace with the actual URL if different
    cd rooresearcher
    ```
2.  **Install Dependencies:** Run npm to install the required packages (`express`, `axios`, `dotenv`).
    ```bash
    npm install
    ```
3.  **Configure API Key:**
    *   Create a `.env` file by copying the example: `cp .env.example .env`
    *   Open the `.env` file and replace `your-key-here` with your actual Perplexity API key:
        ```dotenv
        # .env
        PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxx
        ```
    *   **Security:** The `.gitignore` file prevents your `.env` file (containing the API key) from being accidentally committed to Git.

4.  **Configure Roo Code:** You need to tell Roo Code about this new mode and the MCP server that powers its research capabilities.

    *   **Add the MCP Server:** Edit your Roo Code MCP settings file (usually located at `~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json` on Linux). Add the following entry within the `mcpServers` object. **Make sure to replace `/path/to/your/rooresearcher/index.js` with the actual absolute path to the `index.js` file in the cloned repository directory.**
        ```json
        {
          "mcpServers": {
            // ... other servers might be here ...
            "perplexity-search": {
              "command": "node",
              // IMPORTANT: Update this path!
              "args": ["/path/to/your/rooresearcher/index.js"],
              "env": {} // API key is handled by .env in the server directory
            }
          }
        }
        ```
    *   **Add the Custom Mode:** Edit your Roo Code custom modes file (usually `~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.json` on Linux). Add the following mode definition to the `customModes` array:
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
          "source": "global" // Or set to "workspace" if preferred
        }
        ```
    *   **Restart VS Code:** After editing the configuration files, restart VS Code for the changes to take effect.

## Running the MCP Server

The local Perplexity MCP server needs to be running in the background for ResearchMode to function.

1.  **Navigate to the directory:**
    ```bash
    cd /path/to/your/rooresearcher
    ```
2.  **Start the server:**
    ```bash
    node index.js
    ```

The terminal will show `MCP server on port 3000`. Keep this terminal running while you use ResearchMode in Roo Code.

*(Automation Idea: For easier use, you could configure this server to run automatically on system startup using tools like `systemd` on Linux or `pm2`.)*

## Usage

Once set up and the MCP server is running, activate "ResearchMode" in Roo Code (it should appear in the mode selection dropdown). You can now perform tasks like:

*   **Code with Research:** "Refactor this Python function to use async/await. Search for best practices first."
*   **Targeted Research:** "Find examples of Rust's `Result` type used with file I/O."
*   **Documentation Analysis:** "Summarize the main points of the Lynx man page using `lynx -dump 'man:lynx'`."
*   **Code Extraction:** "Search for a JavaScript debounce function example and extract the code from the top result."
*   **Iterative Development:** Roo will use research findings to suggest code, which you can then refine together. Roo is also instructed to document the influence of research in comments or docs.

## Cost Estimation

Perplexity API usage incurs costs based on tokens processed. Based on the development and testing for *this specific setup task*, the estimated cost was approximately **$0.05**. Actual costs will vary significantly depending on the complexity and frequency of your queries. The caching mechanism helps mitigate costs for repeated searches. Monitor your usage via the Perplexity dashboard.

## License

This project is licensed under the **Mozilla Public License 2.0 (MPL 2.0)**. See the `LICENSE` file for details.