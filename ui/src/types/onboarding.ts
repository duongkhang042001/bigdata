export enum QuestionType {
    SINGLE_CHOICE = "single_choice",
    MULTIPLE_CHOICE = "multiple_choice",
    TEXT_INPUT = "text_input",
    SCALE = "scale"
}

export interface QuestionOption {
    id: string;
    label: string;
    value: any;
}

export interface OnboardingQuestion {
    id: string;
    title: string;
    description?: string;
    type: QuestionType;
    options?: QuestionOption[];
    required: boolean;
    order: number;
}

export interface OnboardingQuestionsResponse {
    questions: OnboardingQuestion[];
    total: number;
}

export interface UserAnswer {
    question_id: string;
    answer: any;
}

export interface OnboardingAnswersRequest {
    answers: UserAnswer[];
}

export interface OnboardingAnswersResponse {
    success: boolean;
    message: string;
}

export interface OnboardingStatusResponse {
    completed: boolean;
    message: string;
    completed_at?: string;
}
