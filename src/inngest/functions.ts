import { generateText } from "ai";
import { inngest } from "./client";
import { createAnthropic } from "@ai-sdk/anthropic";


const anthropic = createAnthropic({
    baseURL: 'https://api.minimaxi.com/anthropic/v1',
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ event, step }) => {
     await step.run("generate-text", async () => {
        const response = await generateText({
            model: anthropic('MiniMax-M2.1'),
            prompt: event.data.prompt,
        });
        return response;
     });
  },
);