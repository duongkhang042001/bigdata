import { Injectable } from '@nestjs/common';
import {
    OnboardingQuestionsResponseDto,
    OnboardingAnswersRequestDto,
    OnboardingAnswersResponseDto,
    OnboardingStatusResponseDto,
    UserPreferencesResponseDto,
    OnboardingQuestionDto,
    QuestionType
} from '../dto/onboarding.dto';
import { OnboardingRepository } from '../repositories/onboarding.repository';

export const questions: OnboardingQuestionDto[] = [
    // PHẦN 1: Thông tin cơ bản
    {
        id: 'cooking_skill',
        title: 'Mức độ nấu ăn của bạn như thế nào?',
        description: 'Chúng tôi sẽ gợi ý món ăn phù hợp với khả năng nấu ăn của bạn',
        type: QuestionType.SINGLE_CHOICE,
        options: [
            { id: 'beginner', label: 'Mới bắt đầu', value: 'beginner' },
            { id: 'intermediate', label: 'Trung bình', value: 'intermediate' },
            { id: 'advanced', label: 'Giỏi', value: 'advanced' },
            { id: 'expert', label: 'Chuyên nghiệp', value: 'expert' },
        ],
        required: true,
        order: 1,
    },
    {
        id: 'cooking_time',
        title: 'Bạn thường có bao nhiêu thời gian để nấu ăn?',
        description: 'Chúng tôi sẽ ưu tiên gợi ý những món ăn phù hợp với thời gian của bạn',
        type: QuestionType.SINGLE_CHOICE,
        options: [
            { id: 'under_15', label: 'Dưới 15 phút', value: 'under_15' },
            { id: '15_30', label: '15-30 phút', value: '15_30' },
            { id: '30_60', label: '30-60 phút', value: '30_60' },
            { id: 'over_60', label: 'Trên 1 giờ', value: 'over_60' },
        ],
        required: true,
        order: 2,
    },
    // PHẦN 2: Tình trạng sức khỏe
    {
        id: 'health_conditions',
        title: 'Bạn có đang mắc các bệnh cần kiêng cữ không?',
        description: 'Giúp chúng tôi gợi ý món ăn an toàn cho sức khỏe của bạn',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
            { id: 'diabetes', label: 'Tiểu đường', value: 'diabetes' },
            { id: 'heart_disease', label: 'Tim mạch / Huyết áp', value: 'heart_disease' },
            { id: 'gout', label: 'Gout (bệnh Gút)', value: 'gout' },
            { id: 'acid_reflux', label: 'Trào ngược dạ dày', value: 'acid_reflux' },
            { id: 'fatty_liver', label: 'Gan nhiễm mỡ', value: 'fatty_liver' },
            { id: 'no_conditions', label: 'Không có', value: 'no_conditions' },
        ],
        required: true,
        order: 3,
    },
    {
        id: 'allergies',
        title: 'Bạn có dị ứng với nguyên liệu chế biến nào không?',
        description: 'Giúp chúng tôi tránh gợi ý những món ăn có thể gây dị ứng',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
            { id: 'seafood', label: 'Hải sản (tôm, cua, mực...)', value: 'seafood' },
            { id: 'eggs', label: 'Trứng', value: 'eggs' },
            { id: 'dairy', label: 'Sữa động vật / Lactose', value: 'dairy' },
            { id: 'soy', label: 'Đậu nành', value: 'soy' },
            { id: 'olive_oil', label: 'Dầu olive', value: 'olive_oil' },
            { id: 'no_allergies', label: 'Không có', value: 'no_allergies' },
        ],
        required: true,
        order: 4,
    },
    {
        id: 'diet_type',
        title: 'Bạn đang theo chế độ ăn kiêng nào không?',
        description: 'Chúng tôi sẽ gợi ý món ăn phù hợp với chế độ ăn của bạn',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
            { id: 'keto', label: 'Keto', value: 'keto' },
            { id: 'eat_clean', label: 'Eat Clean', value: 'eat_clean' },
            { id: 'vegetarian', label: 'Chay (Vegetarian / Vegan)', value: 'vegetarian' },
            { id: 'low_carb', label: 'Low-carb', value: 'low_carb' },
            { id: 'intermittent_fasting', label: 'Intermittent fasting (nhịn ăn gián đoạn)', value: 'intermittent_fasting' },
            { id: 'no_diet', label: 'Không có', value: 'no_diet' },
        ],
        required: true,
        order: 5,
    },
    // PHẦN 3: Chế độ ăn & thói quen
    {
        id: 'food_restrictions',
        title: 'Bạn ăn được các món sau không? (Chọn nếu KHÔNG ĂN được)',
        description: 'Giúp chúng tôi loại bỏ những món không phù hợp với khẩu vị của bạn',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
            { id: 'spicy', label: 'Cay', value: 'spicy' },
            { id: 'salty', label: 'Mặn', value: 'salty' },
            { id: 'sweet', label: 'Ngọt', value: 'sweet' },
            { id: 'sour', label: 'Chua', value: 'sour' },
            { id: 'fried', label: 'Đồ chiên/rán', value: 'fried' },
            { id: 'raw', label: 'Đồ sống (gỏi, sashimi, rau sống)', value: 'raw' },
            { id: 'no_restrictions', label: 'Không có vấn đề', value: 'no_restrictions' },
        ],
        required: true,
        order: 6,
    },
    {
        id: 'health_goal',
        title: 'Mục tiêu chính của bạn là gì?',
        description: 'Chúng tôi sẽ gợi ý món ăn phù hợp với mục tiêu của bạn',
        type: QuestionType.SINGLE_CHOICE,
        options: [
            { id: 'lose_weight', label: 'Giảm cân', value: 'lose_weight' },
            { id: 'gain_weight', label: 'Tăng cân', value: 'gain_weight' },
            { id: 'maintain_weight', label: 'Giữ cân – duy trì vóc dáng', value: 'maintain_weight' },
            { id: 'healthy_eating', label: 'Ăn uống lành mạnh hơn', value: 'healthy_eating' },
            { id: 'disease_control', label: 'Kiểm soát bệnh lý', value: 'disease_control' },
        ],
        required: true,
        order: 7,
    },
    {
        id: 'meals_per_day',
        title: 'Bạn thường ăn bao nhiêu bữa mỗi ngày?',
        description: 'Giúp chúng tôi phân bổ dinh dưỡng phù hợp',
        type: QuestionType.SINGLE_CHOICE,
        options: [
            { id: 'one_meal', label: '1 bữa', value: 'one_meal' },
            { id: 'two_meals', label: '2 bữa', value: 'two_meals' },
            { id: 'three_meals', label: '3 bữa', value: 'three_meals' },
            { id: 'four_plus_meals', label: '4 bữa trở lên', value: 'four_plus_meals' },
        ],
        required: true,
        order: 8,
    },
    {
        id: 'exercise_level',
        title: 'Bạn có thường xuyên vận động không?',
        description: 'Giúp chúng tôi tính toán lượng calo phù hợp',
        type: QuestionType.SINGLE_CHOICE,
        options: [
            { id: 'sedentary', label: 'Ít vận động (ngồi làm việc nhiều)', value: 'sedentary' },
            { id: 'light', label: 'Vận động nhẹ (đi bộ, làm việc nhà)', value: 'light' },
            { id: 'moderate', label: 'Vận động trung bình (tập thể dục ~30 phút/ngày)', value: 'moderate' },
            { id: 'intense', label: 'Vận động mạnh (chạy bộ, gym, thể thao cường độ cao)', value: 'intense' },
        ],
        required: true,
        order: 9,
    },
    {
        id: 'food_principles',
        title: 'Nguyên tắc ăn uống bạn muốn tuân thủ:',
        description: 'Chọn những nguyên tắc ăn uống quan trọng với bạn',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
            { id: 'organic', label: 'Ưu tiên thực phẩm hữu cơ / ít chế biến', value: 'organic' },
            { id: 'no_refined', label: 'Tránh đường, bột tinh luyện', value: 'no_refined' },
            { id: 'vietnamese_priority', label: 'Ưu tiên món Việt', value: 'vietnamese_priority' },
            { id: 'asian_cuisine', label: 'Ưu tiên món Châu Á', value: 'asian_cuisine' },
            { id: 'western_cuisine', label: 'Ưu tiên món Âu', value: 'western_cuisine' },
            { id: 'religious', label: 'Tuân thủ tôn giáo (ăn chay đạo Phật, Halal...)', value: 'religious' },
        ],
        required: true,
        order: 10,
    },
    {
        id: 'preferred_dishes',
        title: 'Bạn thích các món như:',
        description: 'Chọn loại món ăn bạn yêu thích',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
            { id: 'soup_dishes', label: 'Món nước (phở, bún, canh)', value: 'soup_dishes' },
            { id: 'dry_dishes', label: 'Món khô (cơm, xào, chiên)', value: 'dry_dishes' },
            { id: 'mixed_dishes', label: 'Món trộn (salad, gỏi)', value: 'mixed_dishes' },
            { id: 'grilled_dishes', label: 'Món nướng / hấp / luộc', value: 'grilled_dishes' },
        ],
        required: true,
        order: 11,
    },
    {
        id: 'cooking_habit',
        title: 'Bạn có thường nấu ăn không?',
        description: 'Giúp chúng tôi gợi ý món phù hợp với thói quen của bạn',
        type: QuestionType.SINGLE_CHOICE,
        options: [
            { id: 'home_cooking', label: 'Có, nấu ở nhà', value: 'home_cooking' },
            { id: 'buy_food', label: 'Không, thường mua đồ ăn', value: 'buy_food' },
        ],
        required: true,
        order: 12,
    },
    // PHẦN 4: Sở thích cá nhân
    {
        id: 'favorite_foods',
        title: 'Món ăn bạn THÍCH NHẤT là gì? (Nhập tối đa 3 món)',
        description: 'Ví dụ: Phở bò, Bún chả, Bánh mì...',
        type: QuestionType.TEXT_INPUT,
        required: false,
        order: 13,
    },
    {
        id: 'disliked_foods',
        title: 'Món ăn bạn KHÔNG THÍCH hoặc muốn loại trừ:',
        description: 'Nhập các món ăn bạn không muốn được gợi ý',
        type: QuestionType.TEXT_INPUT,
        required: false,
        order: 14,
    },
    {
        id: 'additional_notes',
        title: 'Có điều gì bạn muốn hệ thống lưu ý thêm không?',
        description: 'Ví dụ: Không ăn thịt đỏ, thích ăn nhiều rau...',
        type: QuestionType.TEXT_INPUT,
        required: false,
        order: 15,
    },
];

@Injectable()
export class OnboardingService {
    constructor(private readonly onboardingRepository: OnboardingRepository) { }

    getOnboardingQuestions(): OnboardingQuestionsResponseDto {
        // Danh sách câu hỏi giống Python service

        return {
            questions: questions.sort((a, b) => a.order - b.order),
            total: questions.length,
        };
    }

    async saveOnboardingAnswers(
        userId: string,
        answersRequest: OnboardingAnswersRequestDto,
    ): Promise<OnboardingAnswersResponseDto> {
        try {
            // Get all questions
            const questionsResponse = this.getOnboardingQuestions();
            const questions = questionsResponse.questions;
            const questionIds = new Set(questions.map(q => q.id));
            const requiredQuestionIds = new Set(questions.filter(q => q.required).map(q => q.id));
            const answerQuestionIds = new Set(answersRequest.answers.map(a => a.question_id));

            // Check if all required questions are answered
            const missingRequired = Array.from(requiredQuestionIds).filter(id => !answerQuestionIds.has(id));
            if (missingRequired.length > 0) {
                return {
                    success: false,
                    message: `Vui lòng trả lời các câu hỏi bắt buộc: ${missingRequired.join(', ')}`,
                };
            }

            // Validate unknown question IDs
            const unknownQuestions = Array.from(answerQuestionIds).filter(id => !questionIds.has(id));
            if (unknownQuestions.length > 0) {
                return {
                    success: false,
                    message: `Câu hỏi không tồn tại: ${unknownQuestions.join(', ')}`,
                };
            }

            // Convert userId to int for database (if needed)
            const userIdInt = parseInt(userId, 10);
            if (isNaN(userIdInt)) {
                return {
                    success: false,
                    message: 'ID người dùng không hợp lệ',
                };
            }

            // Prepare answers dictionary for storage
            const answersDict: any = {};
            answersRequest.answers.forEach(a => {
                answersDict[a.question_id] = a.answer;
            });
            answersDict['completed_at'] = new Date().toISOString();
            answersDict['version'] = '1.0';

            // TODO: Save to database (replace with actual repo logic)
            // await this.userPreferencesRepo.createOrUpdate(userIdInt, answersDict);
            console.log('Saving answers for user:', userIdInt, answersDict);

            return {
                success: true,
                message: 'Đã lưu thông tin sở thích thành công!',
            };
        } catch (error) {
            console.error('Error saving onboarding answers:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.',
            };
        }
    }

    async getUserPreferences(userId: string): Promise<UserPreferencesResponseDto> {
        try {
            const userIdInt = parseInt(userId, 10);
            if (isNaN(userIdInt)) {
                return { preferences: {}, has_preferences: false };
            }
            const preferences = await this.onboardingRepository.getUserPreferences(userId);
            if (preferences && preferences.answers) {
                return {
                    preferences: preferences.answers,
                    has_preferences: Object.keys(preferences.answers).length > 0
                };
            } else {
                return { preferences: {}, has_preferences: false };
            }
        } catch (error) {
            console.error('Error getting user preferences:', error);
            return { preferences: {}, has_preferences: false };
        }
    }

    async hasCompletedOnboarding(userId: string): Promise<boolean> {
        const prefs = await this.getUserPreferences(userId);
        return Boolean(prefs.preferences && prefs.preferences.completed_at);
    }

    async getOnboardingStatus(userId: string): Promise<OnboardingStatusResponseDto> {
        const completed = await this.hasCompletedOnboarding(userId);

        return {
            completed,
            message: completed ? 'Đã hoàn thành onboarding' : 'Chưa hoàn thành onboarding',
        };
    }
}
