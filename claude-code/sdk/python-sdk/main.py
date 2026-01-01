import asyncio

from claude_agent_sdk import (AssistantMessage, ClaudeAgentOptions,
                              ResultMessage, query)


async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Create a new file and write 'Hello, World!' into it.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Tools Claude can use
            permission_mode="acceptEdits",
            cwd="./"
        )
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(f"[*] {block.text}")         # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"[*] Tool: {block.name}")   # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"[+] Done: {message.subtype}")      # Final result

asyncio.run(main())
