# cc-plus

A lean, curated set of custom skills, commands, hooks, and plugin config for Claude Code.

## Resources

### Official Documentation

- [Claude Code Docs](https://code.claude.com/docs/en/overview) - Official documentation
- [Claude Code Skills](https://github.com/anthropics/skills/tree/main/skills) - Official skills repository
- [Claude Code Plugins](https://github.com/anthropics/claude-code/tree/main/plugins) - Official plugins

> The document skills (`docx`, `pdf`, `pptx`, `xlsx`) are not redistributed here: they are under Anthropic's proprietary license. Get them from the official [anthropics/skills](https://github.com/anthropics/skills) repo or the `document-skills` plugin.

### Community Resources

- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) - Claude Code workflows, slash-commands, and templates
- [superpowers-claude-code](https://github.com/obra/superpowers-claude-code) - Superpowers for Claude Code
- [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) - Compound Engineering Plugin for Claude Code

### Bundled Plugin Dependencies

cc-plus doesn't vendor these, but declares them as [plugin dependencies](https://code.claude.com/docs/en/plugin-dependencies) in `.claude-plugin/plugin.json`, so installing cc-plus also resolves and enables them:

- [humanizer](https://github.com/blader/humanizer) - removes AI-writing tells from text
- [impeccable](https://github.com/pbakaus/impeccable) - frontend design fluency: `/impeccable polish`, `audit`, `critique`, ...
- [notify](./mods/notify) - desktop notifications, from this marketplace

Their marketplaces must already be known to your Claude Code installation, otherwise install reports a `dependency-unsatisfied` error naming the command to run first:

```bash
/plugin marketplace add blader/humanizer
/plugin marketplace add pbakaus/impeccable
```

## Structure

```
cc-plus/
├── .claude-plugin/             # Plugin metadata (plugin.json, marketplace.json)
├── commands/                   # Custom commands
├── examples/                   # Reference files (e.g. settings.json for manual installs)
├── mods/                       # Function-hook mods, each its own plugin in the marketplace
├── resources/                  # Reference material: example CLAUDE.md files, slash-commands, workflow guides
├── scripts/                    # Standalone utility scripts (model switching, litellm proxy)
├── skills/                     # Custom skills
├── .dockerignore
├── .env.example
├── .gitignore
├── .mcp.json
├── docker-compose.yml
├── Dockerfile
├── LICENCE
├── README.docker.md
└── README.md
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

# Copy commands
cp cc-plus/commands/**/*.md ~/.claude/commands/

# Copy skills
cp -r cc-plus/skills/* ~/.claude/skills/
```

#### Add Notifications

Desktop notifications come from the [`notify`](./mods/notify) mod: install it with `/plugin install notify@cc-plus`, or load it with `claude --plugin-dir path/to/cc-plus/mods/notify`.

#### Configure MCPs

Copy desired MCP servers from `.mcp.json` to your `~/.claude.json`.

**Important:** Replace any `YOUR_*_HERE` placeholders with your actual API keys.

### Option 3: Use as Plugin Directory

```bash
claude --plugin-dir "path/to/cc-plus"
```

### Run with Docker

For a containerized deployment (isolated Linux environment with Claude Code pre-installed), see [README.docker.md](./README.docker.md) for detailed instructions.

## Mods

`mods/` holds Claude Code mods: plugins written as TypeScript function hooks (`hooks/hooks.json` → `{ "modules": ["./register.ts"] }`). Each mod is a separate plugin in this marketplace, so you can install, disable, or break one without touching the others.

| Mod | What it does |
| --- | --- |
| [`notify`](./mods/notify) | Notifications when a session starts, a long turn finishes, a tool fails, or Claude asks for permission. On Windows, an animated popup with a little Claude buddy (built-in WPF); on macOS `osascript`, on Linux `notify-send`. Nothing extra to install. |

```bash
/plugin install notify@cc-plus
```

While developing a mod, load it straight from disk so every save hot-reloads it:

```bash
claude --plugin-dir ./mods/notify
claude plugin validate ./mods/notify
claude plugin test ./mods/notify
```

> Mods are an early-access Claude Code surface and the API may change between releases.

## Configuration

Copy `.env.example` to `.env` and configure your settings:

```bash
cp .env.example .env
```

For manual installs, start from [`examples/settings.json`](./examples/settings.json) and adjust `enabledPlugins`/`hooks` to taste.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See [LICENCE](./LICENCE) for details.
