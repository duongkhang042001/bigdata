import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingController } from './controllers/onboarding.controller';
import { OnboardingService } from './services/onboarding.service';
import { OnboardingRepository } from './repositories/onboarding.repository';
import { UserPreferencesRepository } from './repositories/user-preferences.repository';
import { UserPreferences } from '../entities/user-preferences.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserPreferences])],
    controllers: [OnboardingController],
    providers: [OnboardingService, OnboardingRepository, UserPreferencesRepository],
    exports: [OnboardingService],
})
export class OnboardingModule { }
