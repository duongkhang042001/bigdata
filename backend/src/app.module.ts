import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { GenkitAiModule } from './ai/genkit-ai.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    OnboardingModule,
    GenkitAiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
