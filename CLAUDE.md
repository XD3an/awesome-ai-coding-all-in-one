# Claude Code Configuration

## Spec-Driven Development Commands

This project includes a complete spec-driven development workflow using the following slash commands:

### Core Commands

- `/spec-init` - Initialize spec environment and create steering documents
- `/spec-create <feature-name>` - Create new feature specification (Requirements → Design → Tasks)
- `/spec-execute <task-id> <feature-name>` - Execute individual implementation tasks
- `/spec-status [feature-name]` - Check specification progress and status

### Workflow Overview

1. **Initialize** with `/spec-init` to set up project structure
2. **Create** specifications with `/spec-create` following guided workflow
3. **Execute** tasks individually with `/spec-execute` 
4. **Monitor** progress with `/spec-status`

### Directory Structure

```
.claude/
├── specs/           # Feature specifications
│   └── feature-name/
│       ├── requirements.md
│       ├── design.md  
│       └── tasks.md
├── steering/        # Project guidance
│   ├── product.md   # Product vision
│   ├── tech.md      # Technical standards
│   └── structure.md # Project conventions
└── templates/       # Specification templates
    ├── requirements-template.md
    ├── design-template.md
    └── tasks-template.md
```

### Key Principles

- **Self-contained**: No external tool dependencies
- **Systematic**: Requirements → Design → Tasks → Implementation
- **Atomic tasks**: Each task is small and focused (15-30 minutes)
- **Approval-driven**: User approval required between phases
- **Template-based**: Consistent structure and quality

Always update CLAUDE.md