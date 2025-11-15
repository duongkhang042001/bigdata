import {
    Controller,
    Post,
    Body,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
    Req,
} from '@nestjs/common';
import { GenkitAiService } from '../services/genkit-ai.service';
import {
    GenerateSuggestionsDto,
    GenerateSuggestionsResponseDto,
} from '../dto/ai.dto';
import { QdrantKnowledgeService } from '../services/qdrant-knowledge.service';
import { OnboardingService } from 'src/onboarding/services/onboarding.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('')
@UseGuards(JwtAuthGuard)
export class GenkitAiController {
    private readonly logger = new Logger(GenkitAiController.name);

    constructor(
        private readonly aiService: GenkitAiService,
        private readonly qdranService: QdrantKnowledgeService,
        private readonly onboadingService: OnboardingService
    ) { }


    @Post('suggestions')
    async searchFoodSuggestions(@Body() body: GenerateSuggestionsDto, @Req() req: any,): Promise<GenerateSuggestionsResponseDto> {
        try {
            this.logger.log('Bắt đầu xử lý yêu cầu gợi ý món ăn');
            this.logger.log(`Nhận dữ liệu đầu vào: partial_query='${body.partial_query}', limit='${body.limit}', temperature='${body.temperature}'`);

            const { foods } = await this.aiService.generateArrayFood({
                prompt: body.partial_query,
            });
            this.logger.log(`Đã sinh danh sách món ăn từ AI: ${JSON.stringify(foods)}`);

            const [context, { preferences }] = await Promise.all([
                this.qdranService.searchQdrantBatch(foods, body.limit),
                this.onboadingService.getUserPreferences(req.user.id)
            ])

            this.logger.log(`Tổng hợp dữ liệu người dùng, danh sách món ăn, nhiệt độ hiện tại của người dùng, sử dụng AI để tìm kiếm gợi ý phù hợp`)

            const { suggestions } = await this.aiService.suggestFoods({
                query: foods.toString(),
                temperature: body.temperature ?? 30,
                context: context.map(data => data.payload),
                preferences: preferences
            })

            this.logger.log(`Đã sinh gợi ý món ăn từ AI`);

            return suggestions;
        } catch (error) {
            this.logger.error('searchFoodSuggestions:', error);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Không thể tạo gợi ý món ăn',
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}