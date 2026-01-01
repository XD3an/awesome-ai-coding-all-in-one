import { query } from "@anthropic-ai/claude-agent-sdk";

async function main() {
  // Agentic loop: streams messages as Claude works
  for await (const message of query({
    prompt: "Create a new file and write 'Hello, World!' into it.",
    options: {
      allowedTools: ["Read", "Edit", "Glob"], // Tools Claude can use
      permissionMode: "acceptEdits", // Auto-approve file edits
      cwd: "./", // Working directory
    },
  })) {
    // Print human-readable output
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(`[*] ${block.text}`); // Claude's reasoning
        } else if ("name" in block) {
          console.log(`[*] Tool: ${block.name}`); // Tool being called
        }
      }
    } else if (message.type === "result") {
      console.log(`[+] Done: ${message.subtype}`); // Final result
    }
  }
}

main().catch(console.error);
