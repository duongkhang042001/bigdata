import apiClient from '@/lib/api-client';
import {
    OnboardingQuestionsResponse,
    OnboardingAnswersRequest,
    OnboardingAnswersResponse,
    OnboardingStatusResponse
} from '@/types/onboarding';

export const onboardingService = {
    async getStatus(): Promise<OnboardingStatusResponse> {
        const response = await apiClient.get<OnboardingStatusResponse>('/onboarding/status');
        return response.data;
    },

    async getQuestions(): Promise<OnboardingQuestionsResponse> {
        const response = await apiClient.get<OnboardingQuestionsResponse>('/onboarding/questions');
        return response.data;
    },

    async saveAnswers(data: OnboardingAnswersRequest): Promise<OnboardingAnswersResponse> {
        const response = await apiClient.post<OnboardingAnswersResponse>('/onboarding/answers', data);
        return response.data;
    }
};
