import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

// Export embed function for text embedding
export async function embed({ embedder, content }: { embedder: string; content: string }) {

  try {
    const response = await ai.embed({
      embedder: embedder,
      content,
    });

    const embedding = response[0].embedding;

    // Response is an array, take the first element's embedding
    return embedding;
  } catch (error) {
    throw error;
  }
}

export async function embedBatch({ embedder, contents }: { embedder: string; contents: string[] }) {
  try {
    const batchSize = 10; // Adjust based on API limits
    const batches: string[][] = [];

    for (let i = 0; i < contents.length; i += batchSize) {
      const batch = contents.slice(i, i + batchSize);
      batches.push(batch);
    }

    const allEmbeddings: number[][] = [];

    for (const batch of batches) {
      const batchPromises = batch.map(content =>
        ai.embed({
          embedder: embedder,
          content,
        })
      );

      const batchResults = await Promise.all(batchPromises);
      const batchEmbeddings = batchResults.map(result => result[0].embedding);
      allEmbeddings.push(...batchEmbeddings);
    }

    return allEmbeddings;
  } catch (error) {
    throw error;
  }
}
