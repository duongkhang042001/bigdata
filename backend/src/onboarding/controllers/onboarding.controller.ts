import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OnboardingService } from '../services/onboarding.service';
import {
    OnboardingQuestionsResponseDto,
    OnboardingAnswersRequestDto,
    OnboardingAnswersResponseDto,
    OnboardingStatusResponseDto,
    UserPreferencesResponseDto
} from '../dto/onboarding.dto';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
    constructor(private readonly onboardingService: OnboardingService) { }

    @Get('questions')
    async getOnboardingQuestions(): Promise<OnboardingQuestionsResponseDto> {
        return this.onboardingService.getOnboardingQuestions();
    }

    @Post('answers')
    async saveOnboardingAnswers(
        @Body() answersRequest: OnboardingAnswersRequestDto,
        @Request() req: any,
    ): Promise<OnboardingAnswersResponseDto> {
        const userId = req.user.id;
        return await this.onboardingService.saveOnboardingAnswers(userId, answersRequest);
    }

    @Get('status')
    async getOnboardingStatus(@Request() req: any): Promise<OnboardingStatusResponseDto> {
        const userId = req.user.id;
        return await this.onboardingService.getOnboardingStatus(userId);
    }

    @Get('preferences')
    async getUserPreferences(@Request() req: any): Promise<UserPreferencesResponseDto> {
        const userId = req.user.id;
        return await this.onboardingService.getUserPreferences(userId);
    }
}
