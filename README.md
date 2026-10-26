# Awesome AI Coding all-in-one

A curated collection of AI coding tools, configurations, and resources. Agent skills and subagents are synced automatically from upstream sources.

## Repository Layout

- `.claude/`: Claude Code configuration, as a submodule of [cc-plus](https://github.com/XD3an/cc-plus)
- `.github/`: GitHub Copilot instructions, prompts, and scripts
- `.codex/`: Codex CLI configuration and profiles
- `.cursor/`: Cursor rules
- `.gemini/`: Gemini Code Assist style guide
- `skills/`: synced from [anthropics/skills](https://github.com/anthropics/skills) every 12 hours
- `agents/`: synced from [contains-studio/agents](https://github.com/contains-studio/agents) every 12 hours
- `openclaw/`: Docker setup for OpenClaw

Clone with submodules:

```bash
git clone --recurse-submodules https://github.com/XD3an/awesome-ai-coding-all-in-one.git
```

## Claude Code

- [Claude Code](https://github.com/anthropics/claude-code)：Agentic coding tool in your terminal, IDE, desktop, and browser
- [anthropics/skills](https://github.com/anthropics/skills)：Official Agent Skills
- [Claude Code plugins](https://github.com/anthropics/claude-code/tree/main/plugins)：Official plugins
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)：Workflows, slash commands, and templates
- [cc-plus](https://github.com/XD3an/cc-plus)：My Claude Code plugin: skills, commands, mods, and themes
- [ccusage](https://github.com/ryoppippi/ccusage)：Token usage and cost analysis
- [happy](https://github.com/slopus/happy)：Mobile and web client for Claude Code and Codex

## Codex

- [Codex CLI](https://github.com/openai/codex)：OpenAI's coding agent for the terminal
- [Codex IDE extension](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt)：Codex in VS Code, Cursor, and Windsurf
- [openai/skills](https://github.com/openai/skills)：Official skills catalog for Codex
- [codex-action](https://github.com/openai/codex-action)：Run Codex in GitHub Actions
- [Codex SDK](https://github.com/openai/codex/tree/main/sdk/typescript)：Embed the Codex agent in your own apps

## GitHub Copilot

- [awesome-copilot](https://github.com/github/awesome-copilot)：Official community instructions, prompts, and agents
- [github-copilot-configs](https://github.com/doggy8088/github-copilot-configs)：VS Code configurations for Copilot

## AI IDEs & Editors

- [GitHub Copilot](https://github.com/features/copilot)：AI pair programmer
- [Cursor](https://cursor.com/)：AI code editor
- [Windsurf](https://windsurf.com/)：Agentic IDE
- [Kiro](https://kiro.dev/)：Spec-driven AI IDE by AWS
- [Google AI Studio](https://aistudio.google.com/)：Build apps with Gemini

## Command Line Agents

- [Claude Code](https://github.com/anthropics/claude-code)：Anthropic's coding agent
- [Codex CLI](https://github.com/openai/codex)：OpenAI's coding agent
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)：Google Gemini in your terminal
- [GitHub Copilot CLI](https://github.com/github/copilot-cli)：Copilot coding agent in your terminal
- [Qwen Code](https://github.com/QwenLM/qwen-code)：Coding agent for Qwen models
- [OpenCode](https://opencode.ai/)：Open source terminal coding agent
- [Crush](https://github.com/charmbracelet/crush)：Terminal coding agent by Charm
- [Aider](https://aider.chat/)：AI pair programming in your terminal
- [Goose](https://github.com/block/goose)：Local AI agent with any LLM and MCP servers

## IDE Extensions

- [Cline](https://cline.bot/)：Autonomous coding agent for VS Code
- [Roo Code](https://github.com/RooCodeInc/Roo-Code)：Fork of Cline with multiple modes
- [Kilo Code](https://github.com/Kilo-Org/kilocode)：Open source coding agent for VS Code and JetBrains
- [Continue](https://github.com/continuedev/continue)：Custom AI code assistants
- [Augment Code](https://www.augmentcode.com/)：AI coding assistant for large codebases
- [avante.nvim](https://github.com/yetone/avante.nvim)：Cursor-like AI in Neovim

## App Builders

- [Bolt.new](https://bolt.new/)：Prompt, run, edit, and deploy full-stack apps
- [Lovable](https://lovable.dev/)：Idea to app with an AI full-stack engineer
- [v0](https://v0.app/)：Vercel's app builder for Next.js
- [Replit](https://replit.com/)：Describe an idea and let the agent build it
- [Firebase Studio](https://studio.firebase.google.com/)：Google's agentic cloud development environment
- [Rork](https://rork.app/)：Build mobile apps
- [Dyad](https://www.dyad.sh/)：Free, local, open source app builder

## Spec-Driven Development & Task Management

- [spec-kit](https://github.com/github/spec-kit)：GitHub's toolkit for spec-driven development
- [Task Master](https://github.com/eyaltoledano/claude-task-master)：Task management for AI coding tools

## Model Context Protocol (MCP)

- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)：Reference MCP servers
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)：Curated list of MCP servers
- [container-use](https://github.com/dagger/container-use)：Containerized environments for coding agents

## Agent Configuration Standards

- [AGENTS.md](https://agents.md/)：Open format for guiding coding agents
- [Agent Skills](https://agentskills.io/)：Open format for agent skills
- [agent-rules](https://github.com/steipete/agent-rules)：Rules and knowledge for agents

## Documentation

- [Claude Code Docs](https://code.claude.com/docs)
- [Codex Docs](https://developers.openai.com/codex)
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [Cursor Docs](https://cursor.com/docs)
- [Windsurf Docs](https://docs.windsurf.com/)
- [Gemini API Docs](https://ai.google.dev/)

## Further Reading

- [awesome-vibe-coding](https://github.com/filipecalegario/awesome-vibe-coding)：Curated vibe coding references
- [awesome-code-ai](https://github.com/sourcegraph/awesome-code-ai)：Curated list of AI coding tools
- [The Prompt Engineering Playbook for Programmers](https://addyo.substack.com/p/the-prompt-engineering-playbook-for)：Addy Osmani
- [Not all AI-assisted programming is vibe coding](https://simonwillison.net/2025/Mar/19/vibe-coding/)：Simon Willison
- [Vibe coding MenuGen](https://karpathy.bearblog.dev/vibe-coding-menugen/)：Andrej Karpathy
- [Peer Programming with LLMs, For Senior+ Engineers](https://pmbanugo.me/blog/peer-programming-with-llms)
