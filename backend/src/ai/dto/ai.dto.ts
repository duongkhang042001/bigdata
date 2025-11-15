import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GenerateSuggestionsDto {
    @IsString()
    @IsNotEmpty()
    partial_query: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    @Transform(({ value }) => value ?? null)
    @IsOptional()
    temperature: number | null;

    @IsNumber()
    @Min(1)
    @Max(100)
    limit: number = 10;
}


export class GenerateSuggestionsResponseDto { }


export class GenerateArrayFoodDto {
    prompt: string;
}

export class GenerateArrayFoodResponseDto {
    foods: string[];
}


export class GenerateTextDto {
    @IsString()
    @IsNotEmpty()
    prompt: string;
}

export class GenerateTextResponseDto {
    generatedText: string;
}

export class SemanticSearchDto {
    @IsString()
    @IsNotEmpty()
    query: string;
}

export class SemanticSearchResponseDto {
    response: string;
}

export class SummarizeTextDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsNumber()
    @IsOptional()
    maxLength?: number;
}

export class SummarizeTextResponseDto {
    summary: string;
}

export class EmbedTextDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    embedder?: string;
}

export class EmbedTextResponseDto {
    embedding: number[];
}

export class BatchEmbedDto {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    contents: string[];

    @IsString()
    @IsOptional()
    embedder?: string;
}

export class BatchEmbedResponseDto {
    embeddings: number[][];
}
