# Claude Code Docker Environment
# Build stable Linux environment based on Ubuntu 22.04 LTS
FROM ubuntu:22.04

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

# Copy plugin-template directory into container and rename to .claude
COPY --chown=claude:claude ./plugin-template /home/claude/.claude

# Set up bash aliases
RUN echo 'alias cc="claude --plugin-dir /home/claude/.claude --dangerously-skip-permissions"' >> /home/claude/.bashrc && \
    echo 'alias claude-plugin="claude --plugin-dir /home/claude/.claude"' >> /home/claude/.bashrc

# Set working directory
WORKDIR /home/claude

# Default command is bash, allowing interactive use
CMD ["/bin/bash"]
