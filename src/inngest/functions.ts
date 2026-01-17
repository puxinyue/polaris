import { generateText } from "ai";
import { inngest } from "./client";
import { createAnthropic } from "@ai-sdk/anthropic";
import firecrawl from "@/lib/firecrawl";



const anthropic = createAnthropic({
    baseURL: 'https://api.minimaxi.com/anthropic/v1',
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  const REGEX_URL = /https?:\/\/[^\s]+/g;
  
export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ event, step }) => {
    
    const urls =  await step.run("extract-urls", async () => {
            return event.data.prompt.match(REGEX_URL)??[];
        });

    const scrapedContent = await step.run("scrape-content", async () => {
        const results =  await Promise.all(urls.map(async (url: string) => {
            const result = await firecrawl.scrape(url,{formats: ['markdown']})

            return result.markdown??null;
        }));
        return results.filter(Boolean).join('\n\n');
    });
    const fianlPrompt = scrapedContent?`context:${scrapedContent}\n\nQuestion:${event.data.prompt}`:
    event.data.prompt;
     await step.run("generate-text", async () => {
        const response = await generateText({
            model: anthropic('MiniMax-M2.1'),
            prompt: fianlPrompt,
            experimental_telemetry: { // 添加experimental_telemetry可以计算token用了多少
              isEnabled: true,
              recordInputs: true,
              recordOutputs: true,
            }
        });
        return response;
     });
  },
);