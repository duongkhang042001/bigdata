import { Module } from '@nestjs/common';
import { GenkitAiController } from './controllers/genkit-ai.controller';
import { GenkitAiService } from './services/genkit-ai.service';
import { QdrantKnowledgeService } from './services/qdrant-knowledge.service';
import { OnboardingModule } from 'src/onboarding/onboarding.module';

@Module({
    imports: [OnboardingModule],
    controllers: [GenkitAiController],
    providers: [GenkitAiService, QdrantKnowledgeService],
    exports: [GenkitAiService],
})
export class GenkitAiModule { }