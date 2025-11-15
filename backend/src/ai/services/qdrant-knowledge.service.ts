import { Injectable, Logger } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { embed } from '../genkit';

@Injectable()
export class QdrantKnowledgeService {
    private readonly logger = new Logger(QdrantKnowledgeService.name);
    private readonly client: QdrantClient;
    private readonly collectionName: string;

    constructor() {
        this.client = new QdrantClient({
            url: process.env.QDRANT_URL || 'http://localhost:6333',
            apiKey: process.env.QDRANT_API_KEY,
        });
        this.collectionName = process.env.QDRANT_COLLECTION_NAME || 'food_products';
    }

    async searchQdrant(query: string, limit: number = 5) {
        const startTime = Date.now();

        try {
            const queryEmbedding = await embed({
                embedder: 'googleai/text-embedding-004',
                content: query,
            });

            const results = await this.client.search(this.collectionName, {
                vector: queryEmbedding,
                limit,
                with_payload: true,
            });

            const duration = Date.now() - startTime;
            this.logger.log(`Search completed in ${duration}ms`);

            return results;
        } catch (error) {
            this.logger.error('Error searching Qdrant:', error);
            throw new Error(`Failed to search Qdrant: ${error.message}`);
        }
    }

    async searchQdrantBatch(queries: string[], limit: number = 5) {
        const startTime = Date.now();

        try {
            const queryEmbeddings = await Promise.all(
                queries.map(q =>
                    embed({
                        embedder: 'googleai/text-embedding-004',
                        content: q,
                    }),
                ),
            );

            this.logger.log(`Đã tạo embedding cho ${queries.length} truy vấn:`, JSON.stringify(queryEmbeddings[0]));

            const results = await this.client.searchBatch(this.collectionName, {
                searches: queryEmbeddings.map((vector, i) => ({
                    vector,
                    limit,
                    with_payload: true,
                    with_vector: false,
                })),
            });

            const duration = Date.now() - startTime;

            this.logger.log(
                `Tìm kiếm hoàn thành trong ${duration}ms cho ${queries.length} truy vấn`,
            );

            return results.flat();
        } catch (error) {
            this.logger.error('Error searching Qdrant batch:', error);
            throw new Error(`Failed to search Qdrant batch: ${error.message}`);
        }
    }
}
