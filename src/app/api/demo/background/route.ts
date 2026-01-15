import { inngest } from '../../../../inngest/client';


export async function POST(request: Request) {
  inngest.send({
    name: "demo/generate",
    data: {
      prompt: '写一份四人素食千层面食谱',
    },
  });
  

  return Response.json({ message: 'Event sent' });
}