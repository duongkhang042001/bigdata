import { Injectable, Logger } from '@nestjs/common';
import { embed } from '../genkit';
import {
    BatchEmbedDto,
    BatchEmbedResponseDto,
    EmbedTextDto,
    EmbedTextResponseDto,
    GenerateArrayFoodDto,
    GenerateArrayFoodResponseDto,
} from '../dto/ai.dto';
import { generateArrayFoodFromPrompt } from '../flows/generate-array-food-from-prompt';
import { foodSuggestionFlow, FoodSuggestionInput, FoodSuggestionOutput } from '../flows/semantic-search-contextual-response';

@Injectable()
export class GenkitAiService {
    private readonly logger = new Logger(GenkitAiService.name);

    async generateArrayFood(dto: GenerateArrayFoodDto): Promise<GenerateArrayFoodResponseDto> {
        try {
            this.logger.log(`Generating array of foods for prompt: ${dto.prompt}`);
            const result = await generateArrayFoodFromPrompt({ prompt: dto.prompt });
            return { foods: result.foods };
        } catch (error) {
            this.logger.error('Error generating food array:', error);
            throw new Error(`Failed to generate food array: ${error.message}`);
        }
    }

    async suggestFoods(input: FoodSuggestionInput): Promise<FoodSuggestionOutput> {
        try {
            this.logger.log(`Generating food suggestions for query: ${input.query}`);
            const result = await foodSuggestionFlow(input);
            return result;
        } catch (error) {
            this.logger.error('Error generating food suggestions:', error);
            throw new Error(`Failed to generate food suggestions: ${error.message}`);
        }
    }

    async embedText(dto: EmbedTextDto): Promise<EmbedTextResponseDto> {
        try {
            this.logger.log(`Embedding text: ${dto.content.substring(0, 50)}...`);
            const embedder = dto.embedder || 'googleai/text-embedding-004';
            const embedding = await embed({ embedder, content: dto.content });
            return { embedding };
        } catch (error) {
            this.logger.error('Error embedding text:', error);
            throw new Error(`Failed to embed text: ${error.message}`);
        }
    }

    async batchEmbed(dto: BatchEmbedDto): Promise<BatchEmbedResponseDto> {
        try {
            this.logger.log(`Batch embedding ${dto.contents.length} texts`);
            const embedder = dto.embedder || 'googleai/text-embedding-004';

            const embeddings = await Promise.all(
                dto.contents.map(content => embed({ embedder, content }))
            );

            return { embeddings };
        } catch (error) {
            this.logger.error('Error in batch embedding:', error);
            throw new Error(`Failed to batch embed texts: ${error.message}`);
        }
    }

}