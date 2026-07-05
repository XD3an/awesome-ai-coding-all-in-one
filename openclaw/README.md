# OpenClaw + Ollama

Run [OpenClaw](https://openclaw.ai/) locally with [Ollama](https://ollama.com/) — no cloud API required.

## Resources

### Official Documentation

- [OpenClaw](https://openclaw.ai/) - Official OpenClaw website
- [Ollama](https://ollama.com/) - Local LLM runtime

### Related

- [Ollama Docker Hub](https://hub.docker.com/r/ollama/ollama) - Official Ollama image
- [awesome-ai-coding-all-in-one](https://github.com/XD3an/awesome-ai-coding-all-in-one) - Parent repository

## Structure

```
openclaw/
├── docker-compose.yml      # Service orchestration (openclaw + ollama)
├── Dockerfile              # OpenClaw gateway image
├── .env.example            # Configuration template
├── .env                    # Active config (not committed)
├── run.bat                 # Windows management menu
└── README.md
```

### Service Architecture

```
docker-compose.yml
├── ollama          ← Local LLM service (:11434)
└── openclaw        ← OpenClaw gateway (:18789)
```

`ollama_data` volume is bound to `%USERPROFILE%\.ollama` on the host — models persist across container restarts and removals.

## Quick Start

```bat
run.bat
```

**First run: select `1` (Build + Start).** This will automatically:

1. Generate `.env` from `.env.example` (path filled with current user)
2. Build the OpenClaw image (a few minutes)
3. Start Ollama and pull `gpt-oss:120b-cloud`
4. Start the gateway

Once the gateway is ready, open your browser at: `http://localhost:18789`

### Menu

| Option | Action |
|--------|--------|
| 1 | Build + Start (first run or after code changes) |
| 2 | Start only (already built) |
| 3 | Stop all services |
| 4 | Tail gateway logs |
| 5 | Open CLI shell |
| 6 | Rebuild OpenClaw image (no cache) |
| 7 | Remove containers (model data preserved) |

## Configuration

Copy `.env.example` to `.env` and edit as needed:

```bash
cp .env.example .env
```

Key variables:

```env
OLLAMA_MODEL=gpt-oss:120b-cloud     # Ollama model to use
OPENCLAW_GATEWAY_TOKEN=             # Leave empty to auto-generate
OPENCLAW_TZ=Asia/Taipei             # Timezone
OPENCLAW_GATEWAY_PORT=18789         # Gateway port
OLLAMA_DATA_DIR=C:\Users\USER\.ollama  # Host path for model storage
```

### Enable GPU (NVIDIA)

Uncomment the `deploy` block in `docker-compose.yml`:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

### Channel Configuration

Add the corresponding tokens to `.env`:

```env
TELEGRAM_BOT_TOKEN=123456:ABCDEF...
DISCORD_BOT_TOKEN=...
```

## Manual Commands

```bash
# Build and start all services
docker compose up --build -d

# Check service status
docker compose ps

# Tail gateway logs
docker compose logs -f openclaw

# Stop all services
docker compose down
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See the parent repository for license details.
