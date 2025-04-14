# Roo Code Research Mode with Perplexity & Lynx

This repository contains the code for a custom Roo Code mode ("ResearchMode") that integrates Perplexity API for web search and Lynx for page analysis, enabling autonomous research-augmented software engineering within the Roo Code VS Code extension.

@https://x.com/JamesCherished

## Table of Contents

- [Features](#features)
- [Quick Start: Automated Setup with Roo](#quick-start-automated-setup-with-roo)
- [Manual Installation / Troubleshooting](#manual-installation--troubleshooting)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Clone & Install](#2-clone--install)
  - [3. Configure API Key](#3-configure-api-key)
  - [4. Configure Roo Code Manually](#4-configure-roo-code-manually)
  - [5. Restart VS Code](#5-restart-vs-code)
  - [6. Manual Server Start (If Automatic Fails)](#6-manual-server-start-if-automatic-fails)
        - [Full `custom_modes.json` Snippet (for Manual Setup)](#full-custom_modesjson-snippet-for-manual-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License (MPL 2.0)](#license)


## Features

*   **Perplexity Integration:** Uses the Perplexity API (via a local MCP server) for high-quality, up-to-date web search results using the `sonar` model.
	* About $0.01 per search. You get $5 of monthly free credits with Perplexity Pro, which is enough for intensive use. You can monitor and set limits at https://www.perplexity.ai/account/api
*   **Lynx Integration:** Leverages the Lynx text-based browser for deep page analysis, code extraction, and documentation summarization directly within Roo Code.
*   **Research-Augmented Coding:** Designed for software engineers to seamlessly blend coding tasks with research, using findings to inform code generation, refactoring, and technical decisions.
*   **Caching:** Includes simple file-based caching (`cache.json`) for Perplexity results to conserve API credits and improve response times.
*   **Configurable:** Uses a `.env` file for secure API key management.
*   **Automatic Server Management:** Designed for Roo Code to automatically start and manage the local MCP server once configured.

## Quick Start: Automated Setup with Roo

The easiest way to set up ResearchMode is to let Roo configure it for you.

1.  **Clone the Repository & Install Dependencies:**
    ```bash
    git clone https://github.com/James-Cherished/rooresearcher.git # Or your fork's URL
    cd rooresearcher
    npm install
    ```

Replace URL with https://github.com/James-Cherished/rooresearcher.git for experimental releases, or with your fork's URL

2.  **Start Roo Code & Provide Setup Task:**
    *   Open the `rooresearcher` folder in VS Code.
    *   Ensure the Roo Code extension is enabled.
    *   Start a new task with Roo Code (e.g., using the chat panel) and give it the following prompt:

        ```plaintext
        Task: Configure and activate the ResearchMode from this repository.

        Steps:
        1. Verify prerequisites: Check if Node.js (v14+), npm, and Lynx are installed and available in the system PATH. If Lynx is missing, attempt to install it using the appropriate command for the OS (e.g., 'sudo apt update && sudo apt install lynx -y' for Debian/Ubuntu).
        2. API Key Setup: Check if a `.env` file exists. If not, copy `.env.example` to `.env`. Ask me for my Perplexity API key (obtainable from https://www.perplexity.ai/settings/api) and update the `PERPLEXITY_API_KEY` value in the `.env` file.
        3. Roo Code Configuration:
            a. Determine the absolute path to the `index.js` file in the current workspace (`rooresearcher`).
            b. Read the Roo Code MCP settings file (e.g., `~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json`). Add or update the `perplexity-search` entry within `mcpServers`, ensuring the `args` contains the correct absolute path to `index.js`.
            c. Read the Roo Code custom modes file (e.g., `~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.json`). Add or update the `research-mode` definition using the JSON snippet provided in this repository's README.md (section: Manual Installation / Troubleshooting).
        4. Final Instructions: Inform me that the setup is complete and that I need to restart VS Code for the changes to take effect.

        Note: You might need my approval to edit the Roo Code configuration files (`mcp_settings.json`, `custom_modes.json`) as they are located outside the current workspace. Please request permission before applying changes to these files.
        ```

3.  **Follow Roo's Instructions:** Roo will guide you through the process, potentially asking for your API key and confirmation to edit global configuration files.
4.  **Restart VS Code:** Once Roo confirms the setup is complete, restart VS Code. ResearchMode should now be available, and the MCP server should start automatically.

---
## Usage

Once set up and the MCP server is running (ideally automatically), activate "ResearchMode" in Roo Code. You can now perform tasks like:

*   **Code with Research:** "Refactor this Python function to use async/await. Search for best practices first."
*   **Targeted Research:** "Find examples of Rust's `Result` type used with file I/O."
*   **Documentation Analysis:** "Summarize the main points of the Lynx man page using `lynx -dump 'man:lynx'`."
*   **Code Extraction:** "Search for a JavaScript debounce function example and extract the code from the top result."
*   **Iterative Development:** Roo will use research findings to suggest code, which you can then refine together. Roo is also instructed to document the influence of research in comments or docs.

---
## Manual Installation / Troubleshooting

If you prefer to configure manually or encounter issues with the automated setup:

### 1. Prerequisites
Ensure the following are installed:
    *   [Roo Code VS Code extension](https://marketplace.visualstudio.com/items?itemName=rooveterinaryinc.roo-cline).
    *   [Node.js](https://nodejs.org/) (v14+) & npm (`node -v`, `npm -v`). Install if needed (e.g., `sudo apt update && sudo apt install nodejs npm -y` on Debian/Ubuntu).
    *   [Lynx](https://lynx.invisible-island.net/) text browser (`lynx --version`). Install if needed (e.g., `sudo apt update && sudo apt install lynx -y` on Debian/Ubuntu).
    *   A [Perplexity API key](https://www.perplexity.ai/settings/api).

### 2. Clone & Install
    ```bash
    git clone https://github.com/James-Cherished/rooresearcher.git # Or your fork's URL
    cd rooresearcher
    npm install
    ```

### 3. Configure API Key
    *   `cp .env.example .env`
    *   Edit `.env` and add your Perplexity API key.

### 4. Configure Roo Code Manually
    *   **Find Config Files:** Locate Roo Code's settings directory:
        *   Linux: `~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/`
        *   macOS: `~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/`
        *   Windows: `%APPDATA%\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\`
    *   **Edit `mcp_settings.json`:** Add the `perplexity-search` server entry, ensuring you use the **correct absolute path** to `index.js`.
        ```json
        // Inside mcp_settings.json -> mcpServers object
        "perplexity-search": {
          "command": "node",
          "args": ["/full/absolute/path/to/your/rooresearcher/index.js"], // <-- CHANGE THIS
          "env": {}
        }
        ```
        *(If the file or `mcpServers` object doesn't exist, create them)*
    *   **Edit `custom_modes.json`:** Add the `research-mode` definition to the `customModes` array.
        ```json
        // Inside custom_modes.json -> customModes array
        {
          "slug": "research-mode",
          "name": "ResearchMode",
          "roleDefinition": "You are Roo, a highly skilled software engineer and researcher...", // Full definition below
          "customInstructions": "When coding, you may at any time invoke Perplexity-powered web search...", // Full instructions below
          "groups": ["read", "edit", "command", "browser", "mcp"],
          "source": "global"
        }
        ```
        *(See full JSON snippets below if needed)*

### 5. Restart VS Code
Restart VS Code completely after saving configuration changes.

### 6. Manual Server Start (If Automatic Fails)
    *   If Roo Code doesn't start the server automatically (check Roo Code logs or try using the mode), you can run it manually from the `rooresearcher` directory:
        ```bash
        node index.js
        ```
    *   Keep the terminal running. If this works, the issue is likely the absolute path configured in `mcp_settings.json`.
    *   Consider using `pm2` or `systemd` for persistent background execution if desired.


#### Full `custom_modes.json` Snippet (for Manual Setup)

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
# Contributing

This is a FOSS project, made possible by Roo Code. Please feel free to share your work or contribute to this repo!
---

## License

This project is licensed under the **Mozilla Public License 2.0 (MPL 2.0)**. See the `LICENSE` file for details.

---
