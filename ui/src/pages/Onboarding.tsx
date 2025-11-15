import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { onboardingService } from "@/services/onboarding.service";
import {
    OnboardingQuestion,
    QuestionType,
    UserAnswer,
    OnboardingQuestionsResponse,
    OnboardingStatusResponse
} from "@/types/onboarding";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import peaPodsImage from "@/assets/pea-pods.png";

const Onboarding = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            setIsLoading(true);
            const statusResponse: OnboardingStatusResponse = await onboardingService.getStatus();
            console.log('Onboarding status check:', statusResponse);

            if (statusResponse.completed === true) {
                // Onboarding đã hoàn thành, chuyển hướng đến dashboard
                console.log('Onboarding completed, redirecting to dashboard');
                toast({
                    title: "Onboarding đã hoàn thành",
                    description: "Bạn đã hoàn thành onboarding trước đó.",
                });
                navigate("/dashboard");
                return;
            }

            // Nếu completed === false, tiếp tục fetch questions
            console.log('Onboarding not completed, fetching questions');
            await fetchQuestions();
        } catch (error: any) {
            toast({
                title: "Lỗi kiểm tra trạng thái",
                description: error.response?.data?.detail || "Không thể kiểm tra trạng thái onboarding.",
                variant: "destructive",
            });
            // Vẫn cho phép tiếp tục nếu có lỗi khi kiểm tra status
            await fetchQuestions();
        }
    };

    const fetchQuestions = async () => {
        try {
            const response: OnboardingQuestionsResponse = await onboardingService.getQuestions();
            const sortedQuestions = response.questions.sort((a, b) => a.order - b.order);
            setQuestions(sortedQuestions);
            setTotalQuestions(response.total);
        } catch (error: any) {
            toast({
                title: "Lỗi tải câu hỏi",
                description: error.response?.data?.detail || "Không thể tải câu hỏi. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleNext = () => {
        const currentQuestion = questions[currentQuestionIndex];

        // Validate required questions
        if (currentQuestion?.required && !answers[currentQuestion.id]) {
            toast({
                title: "Vui lòng trả lời câu hỏi",
                description: "Câu hỏi này là bắt buộc.",
                variant: "destructive",
            });
            return;
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Validate all required questions are answered
            const unansweredRequired = questions.filter(q =>
                q.required && !answers[q.id]
            );

            if (unansweredRequired.length > 0) {
                toast({
                    title: "Vui lòng trả lời tất cả câu hỏi bắt buộc",
                    description: `Còn ${unansweredRequired.length} câu hỏi bắt buộc chưa được trả lời.`,
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }

            // Kiểm tra lại trạng thái onboarding trước khi lưu
            const statusResponse: OnboardingStatusResponse = await onboardingService.getStatus();

            if (statusResponse.completed === true) {
                // Onboarding đã hoàn thành, không cần lưu lại
                toast({
                    title: "Onboarding đã hoàn thành",
                    description: "Bạn đã hoàn thành onboarding trước đó.",
                });
                navigate("/dashboard");
                return;
            }

            // Prepare answers for submission chỉ khi completed === false
            const userAnswers: UserAnswer[] = Object.entries(answers).map(([questionId, answer]) => ({
                question_id: questionId,
                answer: answer
            }));

            await onboardingService.saveAnswers({ answers: userAnswers });

            console.log('Onboarding answers saved successfully');

            toast({
                title: "Hoàn thành onboarding",
                description: "Cảm ơn bạn đã hoàn thành các câu hỏi. Chúng tôi sẽ cung cấp gợi ý món ăn phù hợp với bạn!",
            });

            // Delay một chút trước khi navigate để đảm bảo toast hiển thị
            setTimeout(() => {
                console.log('Navigating to dashboard after onboarding completion');
                navigate("/dashboard");
            }, 1000);
        } catch (error: any) {
            toast({
                title: "Lỗi lưu thông tin",
                description: error.response?.data?.detail || "Không thể lưu thông tin. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderQuestionInput = (question: OnboardingQuestion) => {
        const currentValue = answers[question.id];

        switch (question.type) {
            case QuestionType.SINGLE_CHOICE:
                return (
                    <RadioGroup
                        value={currentValue || ""}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                        className="space-y-3"
                    >
                        {question.options?.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={option.value}
                                    id={option.id}
                                    className="border-gray-400 text-foreground"
                                />
                                <Label htmlFor={option.id} className="cursor-pointer">
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            case QuestionType.MULTIPLE_CHOICE:
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={option.id}
                                    checked={currentValue?.includes(option.value) || false}
                                    onCheckedChange={(checked) => {
                                        const newValue = currentValue || [];
                                        if (checked) {
                                            handleAnswerChange(question.id, [...newValue, option.value]);
                                        } else {
                                            handleAnswerChange(question.id, newValue.filter((v: any) => v !== option.value));
                                        }
                                    }}
                                    className="border-gray-400"
                                />
                                <Label htmlFor={option.id} className="cursor-pointer">
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                );

            case QuestionType.TEXT_INPUT:
                return (
                    <Textarea
                        value={currentValue || ""}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Nhập câu trả lời của bạn..."
                        className="min-h-[100px] border-gray-300 focus:border-foreground"
                    />
                );

            case QuestionType.SCALE:
                return (
                    <div className="space-y-4">
                        <Slider
                            value={[currentValue || 5]}
                            onValueChange={(value) => handleAnswerChange(question.id, value[0])}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>1</span>
                            <span className="font-medium">Mức độ: {currentValue || 5}/10</span>
                            <span>10</span>
                        </div>
                    </div>
                );

            default:
                return (
                    <Input
                        value={currentValue || ""}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Nhập câu trả lời..."
                        className="border-gray-300 focus:border-foreground"
                    />
                );
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex">
                {/* Left side - Image */}
                <div className="flex-1 relative overflow-hidden">
                    <img
                        src={peaPodsImage}
                        alt="Fresh pea pods"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-pea-green/20 to-fresh-green/30" />
                </div>

                {/* Right side - Loading */}
                <div className="flex-1 flex items-center justify-center p-8 bg-warm-white">
                    <Card className="w-full max-w-2xl border-0 shadow-none bg-transparent">
                        <CardContent className="space-y-6 p-0">
                            <div className="text-center space-y-4">
                                <Skeleton className="h-8 w-3/4 mx-auto" />
                                <Skeleton className="h-4 w-1/2 mx-auto" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <div className="min-h-screen flex">
            {/* Left side - Image */}
            <div className="flex-1 relative overflow-hidden">
                <img
                    src={peaPodsImage}
                    alt="Fresh pea pods"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-pea-green/20 to-fresh-green/30" />

                {/* Progress indicator on image */}
                <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">
                                Tiến độ
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {currentQuestionIndex + 1}/{totalQuestions}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-pea-green to-fresh-green h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Onboarding Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-warm-white">
                <Card className="w-full max-w-2xl border-0 shadow-none bg-transparent">
                    <CardContent className="space-y-8 p-0">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-foreground">
                                Khởi tạo hồ sơ
                            </h1>
                            <p className="text-muted-foreground">
                                Hãy cho chúng tôi biết về sở thích của bạn để có những gợi ý món ăn phù hợp nhất
                            </p>
                        </div>

                        {/* Question */}
                        {currentQuestion && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <h2 className="text-xl font-semibold text-foreground">
                                            {currentQuestion.title}
                                        </h2>
                                        {currentQuestion.required && (
                                            <span className="text-tomato text-sm">*</span>
                                        )}
                                    </div>
                                    {currentQuestion.description && (
                                        <p className="text-muted-foreground text-sm">
                                            {currentQuestion.description}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {renderQuestionInput(currentQuestion)}
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                className="flex items-center space-x-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Quay lại</span>
                            </Button>

                            {currentQuestionIndex === questions.length - 1 ? (
                                <Button
                                    type="button"
                                    variant="fresh"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-2"
                                >
                                    <span>{isSubmitting ? "Đang lưu..." : "Hoàn thành"}</span>
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="fresh"
                                    onClick={handleNext}
                                    className="flex items-center space-x-2"
                                >
                                    <span>Tiếp theo</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;