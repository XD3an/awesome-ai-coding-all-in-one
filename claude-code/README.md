# Claude Code Configuration

A comprehensive collection of AI-powered development tools and workflows designed to enhance productivity with Claude Code. This repository provides specialized agents, custom commands, and spec-driven development workflows for accelerated software development.

- [claude-code docs](https://code.claude.com/docs/en/overview)

- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)：Claude Code workflows, slash-commands, and templates

- [claude-code-skills](https://github.com/anthropics/skills/tree/main/skills)

- [claude-code-plugin](https://github.com/anthropics/claude-code/tree/main/plugins)

## Structure

```
claude-code/
├── commands/                   # Slash commands collection
├── hooks/                      # Event handlers collection
├── agents/                     # Specialized agents collection
├── skills/                     # Agent Skills collection
├── resources/                  # Documentation and resources collection
├── sdk/                        # SDK examples and templates collection
├── plugin-template/            # Template for creating Claude Code plugins
│   ├── .claude-plugin/
│   │   └── plugin.json         # Plugin metadata
│   ├── commands/               # Slash commands (optional)
│   ├── agents/                 # Specialized agents (optional)
│   ├── skills/                 # Agent Skills (optional)
│   ├── hooks/                  # Event handlers (optional)
│   ├── .mcp.json               # External tool configuration (optional)
│   └── README.md               # Plugin documentation
└── README.md                   # readme file
```

## Usage

```
claude --plugin-dir ./plugin-template
```
