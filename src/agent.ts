import { AIChatAgent } from "@cloudflare/ai-chat";
import { convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { streamAgent } from "./agent-core";
import { compactHistory } from "./context/compaction";

interface Env extends Cloudflare.Env {
  OPENAI_API_KEY: string;
  TAVILY_API_KEY: string;
}

export class DesignAgent extends AIChatAgent<Env> {
  async onChatMessage() {
    const openai = createOpenAI({ apiKey: this.env.OPENAI_API_KEY });
    const model = openai("gpt-5.4-mini");

    // Compact older history if the conversation has gotten long. The recent
    // few turns stay verbatim; everything older is collapsed into one
    // summary system message.
    const allMessages = await convertToModelMessages(this.messages);
    const messages = await compactHistory(allMessages, { model });

    const result = streamAgent({
      model,
      messages,
      env: { TAVILY_API_KEY: this.env.TAVILY_API_KEY },
    });

    return result.toUIMessageStreamResponse();
  }
}
