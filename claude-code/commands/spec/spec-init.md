# Spec Init Command

Initialize the spec-driven development environment for the current project.

## Usage

```
/spec-init
```

## Instructions

You are helping set up the spec-driven development environment. This command creates the necessary directory structure and configuration files for the project.

### Initialization Process

1. **Create Directory Structure**

   ```
   .claude/
   ├── specs/           # Feature specifications directory
   ├── steering/        # Project guidance documents
   └── templates/       # Template files for spec creation
   ```

2. **Check Existing Structure**

   - Verify if `.claude/` directory already exists
   - Check for existing steering documents
   - Identify what needs to be created vs. what already exists

3. **Create Steering Documents** (if they don't exist)

   **Create `.claude/steering/product.md`**:

   ```markdown
   # Product Vision and Goals

   ## Product Overview

   [Describe the product's purpose and main value proposition]

   ## Target Users

   [Define primary user personas and their needs]

   ## Core Features

   [List the main features that define the product]

   ## Success Metrics

   [Define how success is measured for this product]

   ## Product Principles

   [Core principles that guide product decisions]
   ```

   **Create `.claude/steering/tech.md`**:

   ```markdown
   # Technical Standards and Patterns

   ## Technology Stack

   [Document the primary technologies, frameworks, and libraries used]

   ## Architecture Patterns

   [Describe the architectural patterns and conventions followed]

   ## Code Standards

   [Define coding standards, naming conventions, and best practices]

   ## Development Workflow

   [Outline the development process and tools used]

   ## Testing Strategy

   [Define testing approaches and requirements]
   ```

   **Create `.claude/steering/structure.md`**:

   ```markdown
   # Project Structure Conventions

   ## Directory Organization

   [Define how the project is organized and where different types of files go]

   ## File Naming Conventions

   [Specify naming patterns for files and directories]

   ## Component Organization

   [Describe how components, modules, and features are structured]

   ## Configuration Management

   [Explain how configuration files are organized and managed]
   ```

4. **Verify Template Files**

   - Check if template files exist in `.claude/templates/`
   - Ensure requirements-template.md, design-template.md, and tasks-template.md are available
   - Report any missing templates that need to be created

5. **Project Analysis**
   - Analyze the current project structure
   - Identify existing patterns and conventions
   - Suggest steering document content based on discovered patterns

### Initialization Report

After setup, provide a comprehensive report:

```
## Spec Environment Initialized ✓

### Directory Structure Created
- [x] .claude/specs/ (ready for feature specifications)
- [x] .claude/steering/ (project guidance documents)
- [x] .claude/templates/ (template files available)

### Steering Documents
- [x] product.md - Product vision and goals
- [x] tech.md - Technical standards and patterns
- [x] structure.md - Project structure conventions

### Available Commands
- `/spec-create <feature-name>` - Create new feature specification
- `/spec-execute <task-id> <feature-name>` - Execute specific task
- `/spec-status [feature-name]` - Check specification progress

### Next Steps
1. Review and customize steering documents in .claude/steering/
2. Create your first feature specification with `/spec-create <feature-name>`
3. Follow the guided workflow through Requirements → Design → Tasks → Implementation
```

### Pre-existing Structure Handling

**If .claude/ already exists**:

- Report what's already present
- Only create missing components
- Preserve existing steering documents
- Ask if user wants to update any existing files

**If steering documents exist**:

- Report current steering document status
- Suggest reviewing them for completeness
- Don't overwrite existing content

### Project Pattern Detection

Analyze the current project to suggest steering document content:

1. **Technology Detection**

   - Check package.json, requirements.txt, Cargo.toml, etc.
   - Identify frameworks and libraries in use
   - Detect testing frameworks and tools

2. **Structure Analysis**

   - Examine directory organization
   - Identify naming patterns
   - Look for existing architectural patterns

3. **Configuration Discovery**
   - Find build tools and configuration files
   - Identify linting and formatting tools
   - Detect CI/CD configurations

### Error Handling

**Permission Issues**:

- Report if directories cannot be created
- Suggest alternative locations or manual creation

**Existing Content Conflicts**:

- Never overwrite existing steering documents
- Report conflicts and suggest manual review

**Missing Templates**:

- Report missing template files
- Suggest manual template creation or update

## Examples

```bash
# Initialize spec environment
/spec-init
```

## Success Criteria

A successful initialization includes:

- [x] Directory structure created (.claude/specs/, .claude/steering/)
- [x] Steering documents created with project-specific content
- [x] Template availability confirmed
- [x] Project patterns analyzed and documented
- [x] Clear next steps provided to user
