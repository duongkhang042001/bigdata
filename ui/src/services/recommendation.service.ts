import apiClient from '@/lib/api-client';

export interface FoodSuggestionAPI {
    food_id: number;
    dish_name: string;
    description: string;
    dish_type?: string;
    cooking_time?: string;
    ingredients?: string;
    cooking_method?: string;
    dish_tags?: string;
    calories?: number;
    image_link?: string;
    similarity_score: number;
    match_type: string;
}

export interface SearchSuggestRequest {
    partial_query: string;
    limit?: number;
    temperature?: number;
}

export const recommendationService = {
    async getFoodSuggestions(request: SearchSuggestRequest): Promise<FoodSuggestionAPI[]> {
        const response = await apiClient.post<FoodSuggestionAPI[]>('/suggestions', request);
        return response.data;
    }
};
