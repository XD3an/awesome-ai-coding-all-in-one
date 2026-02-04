# Scripts

## Use Claude Code over GitHub Copilot (`litellm-copilot.ps1`)

Use GitHub Copilot's model quota with Claude Code through LiteLLM proxy.

### Quick Start

```powershell
# 1. Initialize (generate keys and config)
.\litellm-copilot.ps1 init

# 2. Setup litellm-proxy (first time only)
cd litellm-proxy
uv add "litellm[proxy]"
cd ..

# 3. Start LiteLLM Proxy
.\litellm-copilot.ps1 start

# 4. In another terminal, switch Claude Code connection
.\litellm-copilot.ps1 switch
claude
```

### Commands

| Command  | Description                                                           |
| -------- | --------------------------------------------------------------------- |
| `init`   | Generate keys (`litellm-keys.env`) and config (`copilot-config.yaml`) |
| `start`  | Start LiteLLM Proxy server                                            |
| `switch` | Set environment variables to connect Claude Code to LiteLLM           |
| `status` | Check service status                                                  |

### Parameters

| Parameter    | Description                    | Default                    |
| ------------ | ------------------------------ | -------------------------- |
| `-Model`     | Model to use                   | `claude-opus-4-5-20250514` |
| `-Port`      | LiteLLM port                   | `4000`                     |
| `-Force`     | Force overwrite existing files | -                          |
| `-DebugMode` | Enable detailed debug output   | -                          |

### Available Models (you can add your own)

| Model Name                   | Copilot Type    | Description    |
| ---------------------------- | --------------- | -------------- |
| `claude-opus-4-5-20250514`   | Premium (3x)    | Best reasoning |
| `claude-sonnet-4-5-20250514` | Premium (1x)    | Balanced       |
| `claude-sonnet-4-20250514`   | Premium (1x)    | Coding focused |
| `claude-haiku-4-5-20250514`  | Premium (0.33x) | Fast response  |
| `gpt-4o`                     | **Included**    | Free to use    |
| `gpt-4.1`                    | **Included**    | Free to use    |
| `gpt-5-mini`                 | **Included**    | Free to use    |
| `gpt-5`                      | Premium (1x)    | -              |
| `gemini-2.5-pro`             | Premium (1x)    | -              |
| `gemini-3-flash`             | Premium (0.33x) | Fast response  |

### Switch Models

```powershell
# Use Claude Opus 4.5 (default)
.\litellm-copilot.ps1 switch

# Use free GPT-4o
.\litellm-copilot.ps1 switch -Model gpt-4o

# Use Gemini
.\litellm-copilot.ps1 switch -Model gemini-2.5-pro
```

### File Structure

```
scripts/
├── litellm-copilot.ps1   # Main script
├── litellm-keys.env      # Keys (auto-generated)
├── copilot-config.yaml   # LiteLLM config (auto-generated)
├── litellm-proxy/        # uv virtual environment
└── cc-switch.ps1         # Model switch (legacy)
```

---

## Switch Model (`cc-switch.ps1`)

Quickly switch Claude Code model and API endpoint.

```powershell
.\cc-switch.ps1 -Model "claude-3-5-sonnet-20241022"

# Custom API
.\cc-switch.ps1 -Model "claude-3-5-sonnet-20241022" `
  -ApiKey "your-api-key" `
  -BaseUrl "https://api.anthropic.com"
```

**Parameters:**

- `-Model` (Required): Model name
- `-ApiKey` (Optional): API key
- `-AuthToken` (Optional): Auth token (default 'ollama')
- `-BaseUrl` (Optional): API endpoint (default 'http://localhost:11434')
