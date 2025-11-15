import { IsString, IsBoolean, IsNumber, IsArray, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionType {
    SINGLE_CHOICE = 'single_choice',
    MULTIPLE_CHOICE = 'multiple_choice',
    TEXT_INPUT = 'text_input',
    SCALE = 'scale',
}

export class QuestionOptionDto {
    @IsString()
    id: string;

    @IsString()
    label: string;

    value: any;
}

export class OnboardingQuestionDto {
    @IsString()
    id: string;

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(QuestionType)
    type: QuestionType;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionOptionDto)
    options?: QuestionOptionDto[];

    @IsBoolean()
    required: boolean = true;

    @IsNumber()
    order: number;
}

export class OnboardingQuestionsResponseDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OnboardingQuestionDto)
    questions: OnboardingQuestionDto[];

    @IsNumber()
    total: number;
}

export class UserAnswerDto {
    @IsString()
    question_id: string;

    answer: any;
}

export class OnboardingAnswersRequestDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserAnswerDto)
    answers: UserAnswerDto[];
}

export class OnboardingAnswersResponseDto {
    @IsBoolean()
    success: boolean;

    @IsString()
    message: string;
}

export class OnboardingStatusResponseDto {
    @IsBoolean()
    completed: boolean;

    @IsString()
    message: string;
}

export class UserPreferencesResponseDto {
    preferences: any;

    @IsBoolean()
    has_preferences: boolean;
}
