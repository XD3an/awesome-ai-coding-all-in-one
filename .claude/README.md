# cc-plus

A comprehensive collection of custom plugins, skills, commands, and configurations for Claude Code.

## Resources

### Official Documentation

- [Claude Code Docs](https://code.claude.com/docs/en/overview) - Official documentation
- [Claude Code Skills](https://github.com/anthropics/skills/tree/main/skills) - Official skills repository
- [Claude Code Plugins](https://github.com/anthropics/claude-code/tree/main/plugins) - Official plugins

### Community Resources

- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) - Claude Code workflows, slash-commands, and templates
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code) - Battle-tested configs from an Anthropic hackathon winner
- [superpowers-claude-code](https://github.com/obra/superpowers-claude-code) - Superpowers for Claude Code
- [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) - Compound Engineering Plugin for Claude Code

## Structure

```
cc-plus/
├── .claude-plugin/             # Plugin metadata
├── agents/                     # Custom agents
├── commands/                   # Custom commands
├── contexts/                   # Context definitions
├── examples/                   # Example files
├── hooks/                      # Custom hooks
├── resources/                  # Documentation and resources
├── rules/                      # Coding rules and guidelines
├── skills/                     # Custom skills
├── .dockerignore
├── .env.example
├── .gitignore
├── .mcp.json
├── docker-compose.yml
├── Dockerfile
├── LICENCE
├── README.docker.md
├── README.md
└── settings.json
```

## Usage

### Option 1: Install as Plugin

The easiest way to use this collection - install as a Claude Code plugin:

```bash
# Add this repo as a marketplace
/plugin marketplace add XD3an/cc-plus

# Install the plugin
/plugin install cc-plus@cc-plus
```

Or add directly to your `~/.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "cc-plus@cc-plus": true
  }
}
```

### Option 2: Manual Installation

If you prefer manual control over what's installed:

```bash
# Clone the repo
git clone https://github.com/<your-username>/cc-plus.git

# Copy agents to your Claude config
cp cc-plus/agents/*.md ~/.claude/agents/

# Copy commands
cp cc-plus/commands/**/*.md ~/.claude/commands/

# Copy contexts
cp cc-plus/contexts/*.md ~/.claude/contexts/

# Copy rules
cp cc-plus/rules/*.md ~/.claude/rules/

# Copy skills
cp -r cc-plus/skills/* ~/.claude/skills/
```

#### Add Hooks

Copy the hooks from `hooks/hooks.json` to your `~/.claude/settings.json`.

#### Configure MCPs

Copy desired MCP servers from `.mcp.json` to your `~/.claude.json`.

**Important:** Replace any `YOUR_*_HERE` placeholders with your actual API keys.

### Option 3: Use as Plugin Directory

```bash
claude --plugin-dir "path/to/cc-plus"
```

### Run with Docker

For containerized deployment, see [README.docker.md](./README.docker.md) for detailed instructions.

## Configuration

Copy `.env.example` to `.env` and configure your settings:

```bash
cp .env.example .env
```

Edit `settings.json` to customize plugin behavior.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See [LICENCE](./LICENCE) for details.
