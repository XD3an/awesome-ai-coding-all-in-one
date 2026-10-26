# Claude Code Docker Environment
# Build stable Linux environment based on Ubuntu 24.04 LTS (Node 18 for the npx MCP servers)
FROM ubuntu:24.04

# Set environment variables to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Asia/Taipei \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# Install base tools and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    bash \
    ca-certificates \
    gnupg \
    lsb-release \
    sudo \
    vim \
    nano \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    jq \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -s /bin/bash -G sudo claude && \
    echo "claude ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to user directory
USER claude
WORKDIR /home/claude

# Install Claude Code
RUN curl -fsSL https://claude.ai/install.sh | bash

# Ensure Claude Code is in PATH
ENV PATH="/home/claude/.local/bin:${PATH}"

# Keep all of Claude Code's state (including .claude.json) inside ~/.claude so
# one volume persists login and settings
ENV CLAUDE_CONFIG_DIR=/home/claude/.claude \
    HISTFILE=/home/claude/.history/bash_history

# The plugin lives apart from ~/.claude, so a rebuild always ships the current
# copy instead of being shadowed by the persisted config volume
COPY --chown=claude:claude ./ /home/claude/cc-plus
RUN mkdir -p /home/claude/.claude /home/claude/.history

# Set up bash aliases
RUN echo 'alias cc="claude --plugin-dir /home/claude/cc-plus --dangerously-skip-permissions"' >> /home/claude/.bashrc && \
    echo 'alias claude-plugin="claude --plugin-dir /home/claude/cc-plus"' >> /home/claude/.bashrc

# Set working directory
WORKDIR /home/claude

# Default command is bash, allowing interactive use
CMD ["/bin/bash"]
