import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferences } from '../../entities/user-preferences.entity';

@Injectable()
export class UserPreferencesRepository {
    constructor(
        @InjectRepository(UserPreferences)
        private readonly userPreferencesRepo: Repository<UserPreferences>,
    ) { }

    async findByUserId(userId: number): Promise<UserPreferences | null> {
        return await this.userPreferencesRepo.findOne({ where: { userId } });
    }

    async savePreferences(userId: number, answers: Record<string, any>, version = '1.0'): Promise<UserPreferences> {
        let prefs = await this.findByUserId(userId);
        if (!prefs) {
            prefs = this.userPreferencesRepo.create({ userId, answers, version, isCompleted: true, completedAt: new Date() });
        } else {
            prefs.answers = answers;
            prefs.version = version;
            prefs.isCompleted = true;
            prefs.completedAt = new Date();
        }
        return await this.userPreferencesRepo.save(prefs);
    }
}
