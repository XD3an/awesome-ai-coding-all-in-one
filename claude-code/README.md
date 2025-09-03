# Claude Code - Spec-Driven Development

A comprehensive spec-driven development system for Claude Code that helps you systematically design and implement features through a structured workflow.

## Overview

This system provides a complete workflow for feature development using four main phases:
1. **Requirements** - Define what needs to be built
2. **Design** - Plan how to build it
3. **Tasks** - Break it into atomic implementation steps
4. **Implementation** - Execute tasks one by one

## Quick Start

### 1. Initialize Your Project

```bash
/spec-init
```

This creates the necessary directory structure and guidance documents:
```
.claude/
├── specs/           # Your feature specifications
├── steering/        # Project guidance documents
│   ├── product.md   # Product vision and goals
│   ├── tech.md      # Technical standards
│   └── structure.md # Project conventions
└── templates/       # Specification templates
```

### 2. Create Your First Feature

```bash
/spec-create user-authentication "Allow users to sign up and log in securely"
```

This starts the guided workflow:
- **Requirements Phase**: Creates detailed user stories and acceptance criteria
- **Design Phase**: Develops technical architecture and API design
- **Tasks Phase**: Breaks design into atomic, executable tasks
- **Ready for Implementation**: Tasks ready to execute

### 3. Implement Tasks

```bash
/spec-execute 1 user-authentication
```

Execute tasks one at a time. Each task is:
- **Atomic**: Touches 1-3 files, completable in 15-30 minutes
- **Traceable**: References specific requirements
- **Self-contained**: Clear inputs and outputs

### 4. Monitor Progress

```bash
/spec-status user-authentication
```

Get a comprehensive overview of your feature's progress, including completion status and next steps.

## Commands Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/spec-init` | Initialize spec environment | `/spec-init` |
| `/spec-create` | Create new feature spec | `/spec-create payment-system` |
| `/spec-execute` | Execute specific task | `/spec-execute 2.1 payment-system` |
| `/spec-status` | Check progress | `/spec-status payment-system` |

## Workflow Deep Dive

### Phase 1: Requirements
- **User Stories**: "As a [role], I want [feature], so that [benefit]"
- **Acceptance Criteria**: WHEN/IF/THEN format for clear testing
- **Business Rules**: Constraints and validation requirements
- **Integration Points**: How it connects to existing systems

### Phase 2: Design  
- **Architecture**: System components and interactions
- **Data Models**: Database schema and TypeScript interfaces
- **API Design**: RESTful endpoints with request/response formats
- **UI/UX**: Component architecture and user flows
- **Security**: Authentication, authorization, and data protection

### Phase 3: Tasks
- **Atomic Breakdown**: Each task is small and focused
- **Dependency Analysis**: Understand task relationships
- **Requirement Traceability**: Every task references specific requirements
- **Code Reuse**: Identify existing components to leverage

### Phase 4: Implementation
- **One Task at a Time**: Focus and quality over speed
- **Validation**: Each task is validated against requirements
- **Progress Tracking**: Tasks marked complete in real-time
- **Integration**: Continuous testing with existing codebase

## Best Practices

### Creating Good Requirements
```markdown
✅ Good: "As a user, I want to reset my password via email, so that I can regain access to my account"
❌ Bad: "Users need password functionality"

✅ Good: "WHEN user clicks 'Forgot Password', IF email exists in system, THEN send password reset link"
❌ Bad: "Password reset should work"
```

### Designing Atomic Tasks
```markdown
✅ Good: "Create User model in models/user.ts with email/password fields"
❌ Bad: "Implement user management system"

✅ Good: "Add password hashing utility in utils/auth.ts using bcrypt"  
❌ Bad: "Handle user security"
```

### Following Project Patterns
- **Review steering documents** before starting any phase
- **Leverage existing code** rather than reinventing
- **Follow established conventions** in naming and structure
- **Integrate with existing systems** rather than creating silos

## Directory Structure

```
your-project/
├── .claude/
│   ├── specs/                    # Feature specifications
│   │   └── feature-name/
│   │       ├── requirements.md   # User stories and acceptance criteria
│   │       ├── design.md         # Technical architecture and API design
│   │       └── tasks.md          # Atomic implementation tasks
│   ├── steering/                 # Project guidance
│   │   ├── product.md           # Product vision and goals
│   │   ├── tech.md              # Technical standards and patterns
│   │   └── structure.md         # Project structure conventions
│   └── templates/               # Specification templates
└── claude-code/                 # This directory
    ├── commands/spec/           # Slash command definitions
    └── templates/               # Template files
```

## Example Workflow

Let's walk through creating a simple blog post feature:

### 1. Initialize (One Time)
```bash
/spec-init
# Creates .claude/ structure and steering documents
```

### 2. Create Specification
```bash
/spec-create blog-posts "Allow users to create and manage blog posts"
```

**Requirements Phase Output:**
- User stories for creating, editing, deleting posts
- Acceptance criteria for validation and permissions
- Business rules for content moderation

**Design Phase Output:**
- Data models for posts and categories
- REST API endpoints for CRUD operations
- Component architecture for post editor
- Database schema with relationships

**Tasks Phase Output:**
```markdown
- [ ] 1. Create Post model in models/post.ts with title/content/author fields
- [ ] 2. Add post validation utility in utils/validation.ts
- [ ] 3. Create PostService in services/postService.ts with CRUD methods
- [ ] 4. Add POST /api/posts endpoint in controllers/postController.ts
- [ ] 5. Create PostEditor component in components/posts/PostEditor.tsx
...
```

### 3. Execute Tasks
```bash
/spec-execute 1 blog-posts
# Implements Post model following existing patterns

/spec-execute 2 blog-posts  
# Adds validation utility leveraging existing validation framework

/spec-status blog-posts
# Shows: 2 of 15 tasks completed (13%), next task: PostService implementation
```

## Tips for Success

### 🎯 Start Small
- Begin with simple features to learn the workflow
- Don't skip phases - each builds on the previous
- Get comfortable with the approval process

### 📋 Use the Templates
- Templates ensure consistency and completeness
- They guide you through all necessary considerations
- Customize them for your project's specific needs

### 🔄 Leverage Existing Code
- Always analyze existing patterns before designing
- Reuse components, utilities, and services when possible
- Follow established conventions and naming patterns

### ✅ Validate Continuously
- Each phase has built-in validation criteria
- Don't proceed without explicit user approval
- Test implementations against requirements

### 📊 Monitor Progress
- Use `/spec-status` regularly to track progress
- Address blockers as they arise
- Celebrate completed tasks and phases

## Troubleshooting

### "Templates not found"
- Run `/spec-init` to create template files
- Check that `claude-code/templates/` directory exists

### "Steering documents missing"
- Run `/spec-init` to create steering documents
- Customize `.claude/steering/` files for your project

### "Tasks too broad"
- Break large tasks into smaller, atomic pieces
- Each task should touch 1-3 files maximum
- Focus on single, testable outcomes

### "Integration issues"
- Review existing codebase patterns before implementing
- Follow steering document guidelines
- Test integration points thoroughly

## Advanced Usage

### Custom Templates
Modify templates in `claude-code/templates/` to match your project needs:
- Add sections specific to your domain
- Include project-specific validation criteria
- Customize formatting and structure

### Steering Documents
Keep `.claude/steering/` documents updated:
- **product.md**: Update as product vision evolves
- **tech.md**: Add new patterns and standards
- **structure.md**: Document new conventions

### Multiple Features
Work on multiple features simultaneously:
- Each feature has its own directory under `.claude/specs/`
- Use `/spec-status` without arguments to see all features
- Switch between features with different `/spec-execute` calls

## Contributing

This spec-driven development system is designed to be:
- **Self-contained**: No external dependencies
- **Extensible**: Easy to customize and extend
- **Consistent**: Reliable patterns and workflows
- **Educational**: Teaches good development practices

Improvements and customizations are welcome!