# Claude Code Configuration

A comprehensive collection of AI-powered development tools and workflows designed to enhance productivity with Claude Code. This repository provides specialized agents, custom commands, and spec-driven development workflows for accelerated software development.

## 🚀 Features

- **Specialized AI Agents**: 20+ domain-specific agents for engineering, design, marketing, and project management
- **Custom Commands**: Slash commands for common development tasks and GitHub operations
- **Spec-Driven Development**: Structured workflow for requirement gathering, design, and implementation
- **Resource Collections**: Curated CLAUDE.md files and slash commands from the community
- **Smart Workflows**: Automated processes for commits, PRs, testing, and documentation

## 📁 Project Structure

```
claude-code/
├── agents/                    # Specialized AI agents for different domains
│   ├── engineering/          # Backend, frontend, DevOps, AI/ML agents
│   ├── design/              # UI/UX, brand, visual design agents
│   ├── marketing/           # Growth, content, social media agents
│   ├── product/            # Research, feedback, prioritization agents
│   ├── project-management/ # Producer, tracker, shipper agents
│   ├── studio-operations/  # Legal, finance, analytics agents
│   ├── testing/           # API, performance, workflow testing agents
│   └── bonus/             # Fun and creative agents
├── commands/               # Custom slash commands
│   ├── cc/               # Claude Code meta commands
│   ├── gh/               # GitHub integration commands
│   └── sdd/              # Spec-driven development commands
├── resources/             # Community resources and examples
│   ├── claude.md-files/  # Curated CLAUDE.md configurations
│   ├── slash-commands/   # Community slash commands
│   ├── workflows-knowledge-guides/  # Development workflow guides
│   └── official-documentation/     # Official Claude Code docs
└── README.md             # This file
```

## 🎯 Quick Start

### Using Specialized Agents

Agents are automatically available in your Claude Code environment. Use them for domain-specific tasks:

```bash
# For AI/ML features
/agents/engineering/ai-engineer

# For UI design improvements
/agents/design/ui-designer

# For growth strategy
/agents/marketing/growth-hacker
```

### Custom Commands

Execute custom commands using the slash syntax:

```bash
# Initialize spec-driven development
/sdd:spec-init "Build user authentication system"

# Create a structured commit
/commit

# Review a GitHub PR
/gh:review-pr
```

### Spec-Driven Development Workflow

1. **Initialize**: Create project specification

   ```bash
   /sdd:spec-init "Your project description"
   ```

2. **Requirements**: Generate detailed requirements

   ```bash
   /sdd:spec-requirements <feature-name>
   ```

3. **Design**: Create technical design

   ```bash
   /sdd:spec-design <feature-name>
   ```

4. **Tasks**: Break down into implementable tasks

   ```bash
   /sdd:spec-tasks <feature-name>
   ```

5. **Implementation**: Execute with guidance
   ```bash
   /sdd:spec-impl <feature-name>
   ```

## 🤖 Available Agents

### Engineering

- **AI Engineer**: Machine learning and AI integration
- **Backend Architect**: Server-side architecture and APIs
- **Frontend Developer**: UI implementation and optimization
- **DevOps Automator**: CI/CD and infrastructure
- **Mobile App Builder**: Cross-platform mobile development
- **Rapid Prototyper**: Quick proof-of-concept development
- **Test Writer & Fixer**: Automated testing and debugging

### Design

- **UI Designer**: User interface design and implementation
- **UX Researcher**: User experience analysis and optimization
- **Brand Guardian**: Brand consistency and guidelines
- **Visual Storyteller**: Visual communication and narratives
- **Whimsy Injector**: Creative and playful design elements

### Marketing

- **Growth Hacker**: User acquisition and retention strategies
- **Content Creator**: Marketing content and copy
- **App Store Optimizer**: Mobile app store optimization
- **Social Media Specialists**: Platform-specific engagement (Twitter, Instagram, TikTok, Reddit)

### Product Management

- **Trend Researcher**: Market analysis and trend identification
- **Feedback Synthesizer**: User feedback analysis
- **Sprint Prioritizer**: Feature prioritization and planning

### Project Management

- **Studio Producer**: Project coordination and delivery
- **Experiment Tracker**: A/B testing and data analysis
- **Project Shipper**: Release management and deployment

### Studio Operations

- **Analytics Reporter**: Data analysis and reporting
- **Finance Tracker**: Budget and financial planning
- **Legal Compliance Checker**: Compliance and risk assessment
- **Infrastructure Maintainer**: System maintenance and monitoring
- **Support Responder**: Customer support automation

### Testing

- **API Tester**: API testing and validation
- **Performance Benchmarker**: Performance testing and optimization
- **Test Results Analyzer**: Test result analysis and reporting
- **Workflow Optimizer**: Process improvement and automation
- **Tool Evaluator**: Development tool assessment

## 🛠️ Custom Commands

### Spec-Driven Development (SDD)

- `/sdd:spec-init` - Initialize new specification
- `/sdd:spec-requirements` - Generate requirements document
- `/sdd:spec-design` - Create technical design
- `/sdd:spec-tasks` - Break down implementation tasks
- `/sdd:spec-impl` - Execute implementation
- `/sdd:spec-status` - Check project status
- `/sdd:steering` - Manage project steering documents

### GitHub Integration

- `/gh:fix-issue` - Analyze and fix GitHub issues
- `/gh:review-pr` - Comprehensive PR review

### Development Workflow

- `/commit` - Smart commit with conventional messages
- `/create-pr` - Create pull request with analysis
- `/testing-plan` - Generate comprehensive testing plans

## 📚 Resources

### Community CLAUDE.md Files

Pre-configured CLAUDE.md files for popular projects and frameworks:

- AI/IntelliJ Plugin configurations
- AWS MCP Server setups
- Course Builder workflows
- And many more...

### Slash Commands Library

Reusable slash commands for common tasks:

- Project initialization
- Code cleanup
- Documentation updates
- Release management

## 💡 Example Workflow - Building a Website from Scratch

### Step 1: Project Planning

```bash
# Initialize your website project
/sdd:spec-init "Create a personal portfolio website with home, about, projects, and contact pages"
```

### Step 2: Define Requirements and Design, Tasks

1. Requirements: Use `/sdd:spec-requirements portfolio-website` to outline key features like responsive design, project showcase, and contact form.
2. Design: Use `/sdd:spec-design portfolio-website -y` to create wireframes and design guidelines.
3. Tasks: Use `/sdd:spec-tasks portfolio-website -y` to break down the project into manageable tasks.

```bash
# This creates a specification file with your project requirements
/sdd:spec-requirements portfolio-website

# Create technical design document
/sdd:spec-design portfolio-website -y

# Break down into manageable tasks
/sdd:spec-tasks portfolio-website -y
```

### Step 3: Setup Development Environment

```bash
# Create project structure
mkdir my-portfolio
cd my-portfolio

# Initialize git repository
git init

# Create basic file structure using frontend-developer agent
# - index.html (homepage)
# - about.html (about page)
# - projects.html (projects showcase)
# - contact.html (contact form)
# - css/style.css (main stylesheet)
# - js/script.js (interactive features)
# - images/ (image assets)
```

### Step 4: Start Implementation

```bash
# Execute the implementation plan
/sdd:spec-impl portfolio-website

# This will guide you through implementing each task using appropriate agents
```

### Step 5: Build Core Pages

```bash
# Use ui-designer agent to create homepage
# Focus on: hero section, navigation, responsive layout

# Use content-creator agent for compelling copy
# Create: engaging headlines, project descriptions, about content

# Use frontend-developer agent for technical implementation
# Implement: HTML structure, CSS styling, JavaScript interactions
```

### Step 6: Add Interactive Features

```bash
# Use frontend-developer agent to add:
# - Smooth scrolling navigation
# - Contact form validation
# - Image galleries for projects
# - Mobile-responsive hamburger menu
# - CSS animations and transitions
```

### Step 7: Content Creation

```bash
# Use content-creator agent for:
# - Writing compelling project descriptions
# - Creating engaging about page content
# - Crafting clear calls-to-action

# Use visual-storyteller agent for:
# - Selecting appropriate images
# - Creating consistent visual narrative
# - Optimizing image layouts
```

### Step 8: Styling and Polish

```bash
# Use ui-designer agent for:
# - Color scheme selection
# - Typography optimization
# - Layout improvements
# - Accessibility enhancements

# Use whimsy-injector agent for:
# - Creative hover effects
# - Subtle animations
# - Unique design elements
```

### Step 9: Testing and Optimization

```bash
# Use performance-benchmarker agent to:
# - Test loading speeds
# - Optimize images
# - Minimize CSS/JS files
# - Check mobile responsiveness

# Use test-results-analyzer agent to:
# - Validate HTML/CSS
# - Test cross-browser compatibility
# - Check accessibility compliance
```

### Step 10: SEO and Launch Preparation

```bash
# Use growth-hacker agent for:
# - Meta tags optimization
# - SEO-friendly URLs
# - Social media meta tags
# - Site structure optimization

# Use analytics-reporter agent to:
# - Set up Google Analytics
# - Add tracking codes
# - Configure goal tracking
```

### Step 11: Version Control and Deployment

```bash
# Commit your work
/commit

# Create deployment-ready version
# Use devops-automator agent for:
# - Setting up hosting (GitHub Pages, Netlify, Vercel)
# - Configuring custom domain
# - Setting up SSL certificate
# - Automating deployment process

# Create pull request for review
/create-pr
```

### Bonus: Ongoing Maintenance

```bash
# Use content-creator agent to:
# - Regular blog post creation
# - Project updates
# - Content freshness

# Use analytics-reporter agent to:
# - Monitor site performance
# - Track visitor behavior
# - Generate improvement insights

# Use growth-hacker agent to:
# - Implement A/B tests
# - Optimize conversion rates
# - Expand reach strategies
```

### Quick Start Commands Summary

```bash
# Essential workflow
/sdd:spec-init "Your website description"
/sdd:spec-requirements project-name
/sdd:spec-design project-name
/sdd:spec-tasks project-name

# Development phase - use appropriate agents:
# - frontend-developer (HTML/CSS/JS)
# - ui-designer (visual design)
# - content-creator (copy writing)

# Finalization
/commit
/create-pr
```

## 🔧 Configuration

To use these configurations in your project:

1. Copy relevant agents to your project's `.claude/agents/` directory
2. Add custom commands to `.claude/commands/`
3. Reference community resources in your `CLAUDE.md`
4. Initialize spec-driven development with `/sdd:spec-init`

## 📖 Documentation

For detailed usage instructions and examples, see:

- Individual agent documentation in their respective directories
- Command-specific README files
- Community workflow guides in `/resources/workflows-knowledge-guides/`

## 🤝 Contributing

Contributions are welcome! Please:

1. Follow existing naming conventions
2. Document new agents and commands thoroughly
3. Test configurations before submitting
4. Update this README with new additions

## 📖 References

https://github.com/gotalab/claude-code-spec
