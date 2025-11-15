import { ai } from '../genkit';
import { z } from 'genkit';
import { QdrantKnowledgeService } from '../services/qdrant-knowledge.service';
import { questions } from 'src/onboarding/services/onboarding.service';

const FoodSuggestionInputSchema = z.object({
  query: z.string().min(1, 'Query không được để trống'),
  temperature: z.number().optional(),
  preferences: z.any().nullable().optional(),
  context: z.any().nullable().optional(),
});
export type FoodSuggestionInput = z.infer<typeof FoodSuggestionInputSchema>;

const FoodSuggestionOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      dish_name: z.string(),
      description: z.string(),
      dish_type: z.string(),
      serving_size: z.string(),
      cooking_time: z.number().int(),
      ingredients: z.array(z.string()),
      cooking_method: z.string(),
      dish_tags: z.array(z.string()),
      calories: z.number().int().nullable(),
      fat: z.number().int().nullable(),
      fiber: z.number().int().nullable(),
      sugar: z.number().int().nullable(),
      protein: z.number().int().nullable(),
      image_link: z.string().nullable(),
      nutrient_content: z.string().nullable(),
      similarity_score: z.number(),
      text_similarity: z.number(),
      combined_score: z.number(),
      suggestion_source: z.string(),
      ai_suggestion: z.string(),
      final_ranking_score: z.number(),
    })
  ),
});
export type FoodSuggestionOutput = z.infer<typeof FoodSuggestionOutputSchema>;

const SYSTEM_PROMPT = `
Bạn là một hệ thống gợi ý món ăn, chuyên gia dinh dưỡng. Khi nhận prompt từ user, hãy chỉ trả về một JSON hợp lệ (không văn bản bổ sung, không chú thích, không markdown). JSON phải tuân theo schema sau:
{
  "suggestions": [
    {
      "dish_name": string,              // tên món (tiếng Việt nếu user không chỉ định ngôn ngữ)
      "description": string,            // mô tả ngắn gọn (<= 200 ký tự)
      "dish_type": string,              // loại món ăn (VD: "Món mặn", "Món tráng miệng")
      "serving_size": string,           // khẩu phần (VD: "2 người")
      "cooking_time": integer,          // thời gian nấu (phút)
      "ingredients": string,            // danh sách nguyên liệu chi tiết
      "cooking_method": string,         // cách nấu/chuẩn bị chi tiết
      "dish_tags": string,              // tag của món ăn
      "calories": integer|null,         
      "fat": integer|null,              
      "fiber": integer|null,            
      "sugar": integer|null,            
      "protein": integer|null,          
      "image_link": string|null,        
      "nutrient_content": string|null,  
      "similarity_score": number,       // 0.0 - 1.0
      "text_similarity": number,        // 0.0 - 1.0
      "combined_score": number,         // 0.0 - 1.0
      "suggestion_source": string,      // nguồn gợi ý (VD: "ai_semantic_match")
      "ai_suggestion": string,          
      "final_ranking_score": number     // 0.0 - 1.0
    }
  ]
}

Quy tắc bắt buộc:
- Root object phải có duy nhất khóa "suggestions" (mảng).
- Trả về ít nhất 10 gợi ý, sắp xếp theo độ phù hợp giảm dần.
- Chuỗi không được rỗng (trừ khi cho phép null).
- cooking_time: số nguyên.
- calories, fat, fiber, sugar, protein: số nguyên hoặc null.
- similarity_score, text_similarity, combined_score, final_ranking_score: số thực từ 0.0 đến 1.0.
- Nếu user cung cấp ràng buộc (VD: "chay", "không cay", "dưới 30 phút"), hãy lọc/sắp xếp phù hợp.
- Nếu thiếu thông tin, suy đoán hợp lý nhưng luôn đảm bảo JSON hợp lệ.
- Ngôn ngữ mặc định: tiếng Việt (trừ khi user yêu cầu khác).
- Chỉ sử dụng data foods mà tôi cung cấp, không tự sinh món ăn ngoài dữ liệu đó.

⚠️ Luôn trả về đúng JSON hợp lệ duy nhất. Không in thêm ký tự, văn bản hay giải thích.
`;

const foodSuggestionPrompt = ai.definePrompt({
  name: 'foodSuggestionPrompt',
  input: { schema: FoodSuggestionInputSchema },
  output: { schema: FoodSuggestionOutputSchema },
  system: SYSTEM_PROMPT,
  prompt: async ({ query, context, preferences, temperature }) => {
    return `
    Dựa trên danh sách món ăn mà tôi cung cấp hãy gợi ý các món ăn phù hợp với chủ đề và nhiệt độ thời tiết là ${temperature} độ C: ${query}
    Hãy tuân thủ các yêu cầu của người dùng như: ${formatPreferences(preferences)}
    Danh sách món ăn: ${formatDishList(context)}
    ⚠️ Yêu cầu:
    - Tuân thủ yêu cầu của người dùng và nhiệt độ thời tiết tránh gợi ý món ăn không phù hợp
    - Chỉ trả về JSON hợp lệ theo schema.
    - Không giải thích thêm.
    - Chỉ dùng dữ liệu được cung cấp.
    - Dùng ngôn ngữ tiếng Việt
    `
  }
});

export const foodSuggestionFlow = ai.defineFlow(
  {
    name: 'foodSuggestionFlow',
    inputSchema: FoodSuggestionInputSchema,
    outputSchema: FoodSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await foodSuggestionPrompt(
      input,
      { config: { temperature: 0.3 } }
    );

    return output!;
  }
);


function formatDishList(context: any[] = []) {
  const normalize = (val: any, fallback = 'Không có thông tin') => {
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'string' && val.trim() !== '') return val;
    if (val != null) return String(val);
    return fallback;
  };

  return context
    .map((payload, i) => `
ID: ${payload?.id ?? `food_${i}`}
Tên món: ${normalize(payload?.dish_name, 'Không có tên')}
Mô tả: ${normalize(payload?.description, 'Không có mô tả')}
Loại món: ${normalize(payload?.dish_type ?? payload?.type, 'Không có thông tin')}
Khẩu phần: ${normalize(payload?.serving_size)}
Thời gian nấu: ${payload?.cooking_time ?? 'Không có thông tin'} phút
Cách nấu: ${normalize(payload?.cooking_method ?? payload?.instructions)}
Danh mục: ${normalize(payload?.category, 'Không có danh mục')}
Tags: ${normalize(payload?.dish_tags ?? payload?.tags, 'Không có tags')}
Calories: ${payload?.calories ?? 'Không có thông tin'}
Chất béo: ${payload?.fat ?? 'Không có thông tin'} g
Chất xơ: ${payload?.fiber ?? 'Không có thông tin'} g
Đường: ${payload?.sugar ?? 'Không có thông tin'} g
Protein: ${payload?.protein ?? 'Không có thông tin'} g
Link ảnh: ${payload?.image_link ?? 'Không có ảnh'}
Thông tin dinh dưỡng: ${normalize(payload?.nutrient_content)}
    `)
    .join('\n\n');
}


function formatPreferences(preferences: any) {
  const formatted: Record<string, string | string[]> = {};

  for (const [key, value] of Object.entries(preferences)) {
    const question = questions.find(q => q.id === key);
    if (!question) continue;

    if (typeof value === "string") {
      const optionLabel = question.options?.find(o => o.value === value)?.label;
      formatted[question.title] = optionLabel || value;
    }

    else if (Array.isArray(value)) {
      const labels = value.map(v => {
        return question.options?.find(o => o.value === v)?.label || v;
      });
      formatted[question.title] = labels;
    }

    else {
      formatted[question.title] = String(value);
    }
  }

  return formatted;
}