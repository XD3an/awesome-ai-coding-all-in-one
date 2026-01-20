# Claude Code Docker Environment Guide

This Docker environment provides a complete Linux environment to run Claude Code, allowing you to use all Claude Code features in an isolated container.

## Prerequisites

- Docker and Docker Compose installed
- Claude subscription account (Pro, Max, Teams, or Enterprise) or Claude Console account
- Anthropic API Key

## Quick Start

### 1. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your API Key:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Anthropic API Key:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 2. Build and Start Container

```bash
# Build Docker image
docker-compose build

# Start container (background)
docker-compose up -d

# Or build and start in one command
docker-compose up -d --build
```

### 3. Enter Container and Use Claude Code

```bash
# Enter container interactive shell
docker-compose exec claude-code bash

# Verify Claude Code installation
claude --version

# Start using Claude Code
claude
```

## Common Commands

### Container Management

```bash
# Start container
docker-compose up -d

# Stop container
docker-compose down

# Restart container
docker-compose restart

# View container logs
docker-compose logs -f

# Check container status
docker-compose ps
```

### Enter Container

```bash
# Method 1: Using docker-compose (recommended)
docker-compose exec claude-code bash

# Method 2: Using docker
docker exec -it claude-code bash

# Method 3: Using specific user
docker-compose exec -u claude claude-code bash
```

### Using Claude Code

Inside the container:

```bash
# Basic usage
claude

# Use with plugin-template (shortcut alias)
cc

# Use with plugin-template (full command)
claude --plugin-dir /home/claude/.claude --dangerously-skip-permissions

# Alternative alias
claude-plugin

# Execute specific prompt
claude -p "Analyze this project structure"

# View help
claude --help
```

## Mounted Directories

- `/home/claude/.claude` - Plugin directory (plugin-template copied here)
- `claude-config` volume - Claude Code configuration (persistent)
- `claude-bash-history` volume - Bash history (persistent)

Available aliases: `cc` and `claude-plugin`

## Security Notes

1. **Do not commit `.env` file to version control**

   - `.env` file is already added to `.gitignore`
   - Only commit `.env.example` to version control

2. **API Key Protection**

   - Rotate API Keys regularly
   - Do not hardcode API Keys in code or logs

3. **Container Permissions**
   - Container uses non-root user `claude`
   - Sudo privileges configured for necessary operations

## Troubleshooting

### Claude Code Not Installed or Not Found

```bash
# Rebuild image
docker-compose build --no-cache
docker-compose up -d
```

### Update Claude Code

```bash
# Enter container
docker-compose exec claude-code bash

# Update inside container
curl -fsSL https://claude.ai/install.sh | bash
```

### Check API Key Configuration

```bash
# Enter container
docker-compose exec claude-code bash

# Check environment variable
echo $ANTHROPIC_API_KEY
```

### Clear Persistent Data

If you need to reset configuration:

```bash
# Stop and remove containers and volumes
docker-compose down -v

# Restart
docker-compose up -d
```

## Advanced Configuration

### Customize Resource Limits

Edit resource limits in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: "4" # Increase CPU limit
      memory: 8G # Increase memory limit
```

### Add Additional Tools

Edit `Dockerfile` and add required packages in RUN command:

```dockerfile
RUN apt-get update && apt-get install -y \
    curl \
    git \
    your-additional-tools \
    && apt-get clean
```

### Configure Network

If you need inter-container communication, modify `docker-compose.yml`:

```yaml
networks:
  claude-network:
    driver: bridge
```

### Custom Aliases

The container comes with pre-configured aliases for convenience:

- `cc` - Shortcut for `claude --plugin-dir /home/claude/.claude --dangerously-skip-permissions`
- `claude-plugin` - Alternative alias for using Claude Code with plugin directory

To add your own aliases, you can:

1. Add them to the Dockerfile before building:

```dockerfile
RUN echo 'alias your-alias="your-command"' >> /home/claude/.bashrc
```

2. Or add them interactively inside the container:

```bash
echo 'alias your-alias="your-command"' >> ~/.bashrc
source ~/.bashrc
```

## Related Resources

- [Claude Code Official Documentation](https://code.claude.com/docs/en/overview)
- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code)
- [Claude Code Skills](https://github.com/anthropics/skills/tree/main/skills)
- [Claude Code Plugins](https://github.com/anthropics/claude-code/tree/main/plugins)
