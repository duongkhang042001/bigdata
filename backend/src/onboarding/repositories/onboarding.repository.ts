import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferences } from '../../entities/user-preferences.entity';
import { UserAnswerDto } from '../dto/onboarding.dto';

@Injectable()
export class OnboardingRepository {
    constructor(
        @InjectRepository(UserPreferences)
        private readonly userPreferencesRepo: Repository<UserPreferences>,
    ) { }

    async saveUserAnswers(userId: string, answers: UserAnswerDto[]): Promise<void> {
        const userIdInt = parseInt(userId, 10);
        const answersDict: Record<string, any> = {};
        answers.forEach(a => {
            answersDict[a.question_id] = a.answer;
        });
        const now = new Date();
        await this.userPreferencesRepo.save({
            userId: userIdInt,
            answers: answersDict,
            isCompleted: true,
            completedAt: now,
            version: '1.0',
        });
    }

    async getUserAnswers(userId: string): Promise<UserAnswerDto[]> {
        const userIdInt = parseInt(userId, 10);
        const prefs = await this.userPreferencesRepo.findOne({ where: { userId: userIdInt } });
        if (!prefs || !prefs.answers) return [];
        return Object.entries(prefs.answers).map(([question_id, answer]) => ({ question_id, answer }));
    }

    async hasCompletedOnboarding(userId: string): Promise<boolean> {
        const userIdInt = parseInt(userId, 10);
        const prefs = await this.userPreferencesRepo.findOne({ where: { userId: userIdInt } });
        return Boolean(prefs && prefs.isCompleted);
    }

    async getUserPreferences(userId: string): Promise<UserPreferences | null> {
        const userIdInt = parseInt(userId, 10);
        return await this.userPreferencesRepo.findOne({ where: { userId: userIdInt } });
    }
}
