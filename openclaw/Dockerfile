FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y curl bash openssl && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://openclaw.ai/install.sh | bash

# Install external plugins
RUN openclaw plugins install @openclaw/discord

EXPOSE 18789

CMD ["/bin/sh", "-c", \
  "if [ -z \"$OPENCLAW_GATEWAY_TOKEN\" ]; then \
     export OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32); \
     echo \"[openclaw] Generated token: $OPENCLAW_GATEWAY_TOKEN\"; \
   fi; \
   exec openclaw gateway --bind lan --port 18789 --allow-unconfigured"]
