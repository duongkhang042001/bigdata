import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, CloudRain, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import tomatoImage from "@/assets/tomato.png";
import { recommendationService, FoodSuggestionAPI } from "@/services/recommendation.service";
import logoBuby from "@/logo/logo_buby.svg";

interface FoodSuggestion {
  name: string;
  calories: number;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  image?: string;
  tags?: string[];
  nutrients?: {
    fat?: number;
    fiber?: number;
    sugar?: number;
    protein?: number;
  };
}

interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
}

interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

const MainApp = () => {
  const navigate = useNavigate();
  const { user, logout, checkOnboardingStatus } = useAuth();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [aliveImages, setAliveImages] = useState<{ [url: string]: boolean }>({});

  // Function to get current time
  const updateCurrentTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    const timeString = now.toLocaleString('vi-VN', options);
    setCurrentTime(timeString);
  };

  // Function to get current location
  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  // Function to get location name from coordinates
  const getLocationName = async (lat: number, lon: number): Promise<LocationData> => {
    try {
      // Sử dụng dịch vụ miễn phí để lấy tên vị trí
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=vi`
      );
      const data = await response.json();

      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county || "TP.Hồ Chí Minh";
        return {
          city,
          country: data.address.country_code?.toUpperCase() || "VN",
          latitude: lat,
          longitude: lon
        };
      }

      // Fallback for Vietnam
      return {
        city: "TP.Hồ Chí Minh",
        country: "VN",
        latitude: lat,
        longitude: lon
      };
    } catch (error) {
      console.error('Error getting location name:', error);
      return {
        city: "TP.Hồ Chí Minh",
        country: "VN",
        latitude: lat,
        longitude: lon
      };
    }
  };

  // Function to get weather data using free APIs
  const getWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      // Sử dụng Open-Meteo API - hoàn toàn miễn phí, không cần API key
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,apparent_temperature&timezone=Asia/Ho_Chi_Minh`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();

      // Xử lý dữ liệu từ Open-Meteo
      const currentWeather = data.current_weather;
      const hourlyData = data.hourly;
      const currentHour = new Date().getHours();

      // Lấy apparent temperature (cảm giác như) từ hourly data
      const feelsLike = hourlyData.apparent_temperature[currentHour] || currentWeather.temperature;

      // Chuyển đổi weather code thành mô tả tiếng Việt
      const getWeatherDescription = (code: number): string => {
        const weatherCodes: { [key: number]: string } = {
          0: "trời quang đãng",
          1: "chủ yếu quang đãng",
          2: "một phần có mây",
          3: "có mây",
          45: "có sương mù",
          48: "sương mù có băng giá",
          51: "mưa phùn nhẹ",
          53: "mưa phùn vừa",
          55: "mưa phùn nặng",
          61: "mưa nhẹ",
          63: "mưa vừa",
          65: "mưa to",
          71: "tuyết nhẹ",
          73: "tuyết vừa",
          75: "tuyết to",
          80: "mưa rào nhẹ",
          81: "mưa rào vừa",
          82: "mưa rào to",
          95: "dông",
          96: "dông có mưa đá",
          99: "dông có mưa đá to"
        };
        return weatherCodes[code] || "không xác định";
      };

      return {
        temperature: Math.round(currentWeather.temperature),
        feelsLike: Math.round(feelsLike),
        description: getWeatherDescription(currentWeather.weathercode),
        icon: currentWeather.weathercode.toString()
      };
    } catch (error) {
      console.error('Error getting weather data from Open-Meteo, trying backup API:', error);

      // Backup: Sử dụng wttr.in API (cũng miễn phí)
      try {
        const backupResponse = await fetch(
          `https://wttr.in/${lat},${lon}?format=j1`
        );

        if (backupResponse.ok) {
          const backupData = await backupResponse.json();
          const current = backupData.current_condition[0];

          return {
            temperature: Math.round(parseInt(current.temp_C)),
            feelsLike: Math.round(parseInt(current.FeelsLikeC)),
            description: current.lang_vi?.[0]?.value || current.weatherDesc[0].value.toLowerCase(),
            icon: current.weatherCode
          };
        }
      } catch (backupError) {
        console.error('Backup weather API also failed:', backupError);
      }

      // Fallback: Dữ liệu mẫu dựa trên vị trí Việt Nam
      const isInVietnam = lat >= 8.5 && lat <= 23.5 && lon >= 102 && lon <= 110;
      return {
        temperature: isInVietnam ? Math.floor(Math.random() * 8) + 26 : 26, // 26-34°C cho VN
        feelsLike: isInVietnam ? Math.floor(Math.random() * 8) + 28 : 29, // 28-36°C cho VN
        description: isInVietnam ? "có mây, ẩm ướt" : "có mây",
        icon: "03d"
      };
    }
  };

  // Initialize location and weather
  useEffect(() => {
    const initializeLocationAndWeather = async () => {
      try {
        const position = await getCurrentLocation();
        const { latitude, longitude } = position.coords;

        const [locationData, weatherData] = await Promise.all([
          getLocationName(latitude, longitude),
          getWeatherData(latitude, longitude)
        ]);

        setCurrentLocation(locationData);
        setWeatherData(weatherData);
      } catch (error) {
        console.error('Error getting location or weather:', error);
        // Set fallback data
        setCurrentLocation({
          city: "TP.Hồ Chí Minh",
          country: "VN",
          latitude: 10.8231,
          longitude: 106.6297
        });
        setWeatherData({
          temperature: 26,
          feelsLike: 29,
          description: "có mây",
          icon: "03d"
        });
      }
    };

    initializeLocationAndWeather();

    // Update time every minute
    updateCurrentTime();
    const timeInterval = setInterval(updateCurrentTime, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  // Kiểm tra onboarding status khi component mount
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingCompleted = await checkOnboardingStatus();
        console.log('MainApp - Onboarding completed status:', onboardingCompleted);
        if (!onboardingCompleted) {
          console.log('MainApp - Redirecting to onboarding');
          navigate("/onboarding");
        } else {
          console.log('MainApp - User can stay on dashboard');
        }
      } catch (error) {
        console.error("MainApp - Error checking onboarding status:", error);
        // Nếu có lỗi, vẫn cho phép ở lại dashboard
      }
    };

    if (user) {
      checkOnboarding();
    }
  }, [user, checkOnboardingStatus, navigate]);

  // Function to transform API response to FoodSuggestion format
  const transformAPIResponse = (apiData: any[]): FoodSuggestion[] => {
    return apiData.map(item => {
      // Parse ingredients - handle various formats (comma, newline, semicolon separated)
      let ingredients: string[] = [];
      if (Array.isArray(item.ingredients)) {
        ingredients = item.ingredients.map((ing: string) => ing.trim()).filter((ing: string) => ing.length > 0);
      } else if (typeof item.ingredients === 'string') {
        ingredients = item.ingredients
          .split(/[,;\n]/)
          .map((ing: string) => ing.trim())
          .filter((ing: string) => ing.length > 0);
      }

      // Parse cooking method into instructions - handle various formats
      let instructions: string[] = [];
      if (item.cooking_method) {
        instructions = item.cooking_method
          .split(/[.\n]/)
          .map((step: string) => step.trim())
          .filter((step: string) => step.length > 0);
      }

      let nutrients: any = {};
      if (item.nutrient_content && typeof item.nutrient_content === 'string') {
        const [calories, fat, fiber, sugar, protein] = item.nutrient_content.split(',').map((v: string) => parseFloat(v.trim()));
        nutrients = { fat, fiber, sugar, protein };
      } else {
        nutrients = {
          fat: item.fat,
          fiber: item.fiber,
          sugar: item.sugar,
          protein: item.protein
        };
      }

      return {
        name: item.dish_name,
        calories: item.calories || 0,
        description: item.description || '',
        ingredients,
        instructions,
        image: item.image_link,
        tags: item.dish_tags,
        nutrients
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSelectedFood(null); // Reset selected food immediately when searching

    try {
      // Call the API and wait for response
      const apiResponse = await recommendationService.getFoodSuggestions({
        partial_query: query.trim(),
        limit: 5,
        temperature: weatherData?.temperature // Add temperature to API request
      });

      // Transform API response to match the UI format
      const transformedSuggestions = transformAPIResponse(apiResponse);
      setSuggestions(transformedSuggestions);
    } catch (error) {
      console.error("Error fetching food suggestions:", error);
      // Keep current suggestions and show error state
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodSelect = (food: FoodSuggestion) => {
    setSelectedFood(food);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSettings = () => {
    // In a real app, this would navigate to a settings page
    alert("Chức năng chỉnh sửa thông tin sẽ được triển khai sau!");
  };

  useEffect(() => {
    // Check image links for current suggestions
    const checkImages = async () => {
      const checks = await Promise.all(
        suggestions.map(suggestion => {
          const imageUrl = typeof suggestion.image === 'string' ? suggestion.image : '';
          if (!imageUrl || !imageUrl.startsWith('http')) return Promise.resolve([imageUrl, false] as [string, boolean]);
          return new Promise<[string, boolean]>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve([imageUrl, true]);
            img.onerror = () => resolve([imageUrl, false]);
            img.src = imageUrl;
          });
        })
      );
      const result: { [url: string]: boolean } = {};
      checks.forEach(([url, alive]) => {
        if (typeof url === 'string' && url.length > 0) result[url] = alive;
      });
      setAliveImages(result);
    };
    if (suggestions.length > 0) checkImages();
  }, [suggestions]);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-background shadow-soft">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          {/* Logo */}
          <img src={logoBuby} alt="Logo" className="w-10 h-10 mr-2" />
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>
              {currentLocation?.city || 'TP.Hồ Chí Minh'}, {currentTime || '09 - 09 - 15:38'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Thời tiết hiện tại:</span>
          </div>
          <div className="flex items-center space-x-2">
            <CloudRain className="w-5 h-5" />
            <span className="text-xl font-bold">
              {weatherData?.temperature || 26}°
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettings}
            className="flex items-center space-x-1"
          >
            <span>XIN CHÀO, {user?.full_name?.toUpperCase() || 'USER'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            ĐĂNG XUẤT
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!suggestions.length && !isLoading ? (
          /* Initial State */
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <img
                src={logoBuby}
                alt="Fresh tomato"
                className="w-48 h-48 object-cover"
              />
            </div>

            <h1 className="text-4xl font-bold text-foreground">
              HÔM NAY TA ĂN GÌ?
            </h1>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex space-x-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Yêu cầu của bạn, tôi sẽ gợi ý ..."
                  className="flex-1 h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none text-center"
                />
                <Button type="submit" variant="auth" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Results State */
          <div className="space-y-6">
            {/* Search bar in results */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex space-x-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Yêu cầu của bạn, tôi sẽ gợi ý ..."
                  className="flex-1 h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none text-center"
                />
                <Button type="submit" variant="auth" size="lg" disabled={isLoading}>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </form>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  <div className="text-muted-foreground">Đang tìm kiếm gợi ý cho bạn...</div>
                  <div className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát</div>
                </div>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  Không tìm thấy gợi ý phù hợp với "<strong>{query}</strong>". Hãy thử từ khóa khác!
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {!selectedFood ? (
                  /* Suggestions List */
                  <>
                    <p className="text-center text-muted-foreground">
                      Dưới đây là những gợi ý phù hợp với yêu cầu của bạn:
                    </p>
                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-card transition-shadow border border-gray-200"
                          onClick={() => handleFoodSelect(suggestion)}
                        >
                          <CardContent className="p-4 flex items-center space-x-4">
                            {suggestion.image && aliveImages[suggestion.image] && (
                              <img src={suggestion.image} alt={suggestion.name} className="w-16 h-16 object-cover rounded" />
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground">
                                {suggestion.name}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {suggestion.description}
                              </p>
                              {suggestion.tags && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {suggestion.tags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="bg-light-gray text-foreground text-xs">{tag}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary" className="bg-light-gray text-foreground">
                              {suggestion.calories} calories
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Recipe Details */
                  <div className="space-y-6">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedFood(null)}
                      className="mb-4"
                    >
                      ← Quay lại danh sách gợi ý
                    </Button>

                    <Card className="border border-gray-200">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                              {selectedFood.name}
                            </h2>
                            <p className="text-muted-foreground mb-2">
                              {selectedFood.description}
                            </p>
                            {selectedFood.tags && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {selectedFood.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="bg-light-gray text-foreground text-xs">{tag}</Badge>
                                ))}
                              </div>
                            )}
                            {selectedFood.nutrients && (
                              <div className="text-xs text-muted-foreground mb-2">
                                <span>Fat: {selectedFood.nutrients.fat}g</span>{' | '}
                                <span>Fiber: {selectedFood.nutrients.fiber}g</span>{' | '}
                                <span>Sugar: {selectedFood.nutrients.sugar}g</span>{' | '}
                                <span>Protein: {selectedFood.nutrients.protein}g</span>
                              </div>
                            )}
                          </div>
                          {selectedFood.image && (
                            <img src={selectedFood.image} alt={selectedFood.name} className="w-32 h-32 object-cover rounded" />
                          )}
                          <Badge variant="secondary" className="bg-light-gray text-foreground">
                            {selectedFood.calories} calories
                          </Badge>
                        </div>
                        {selectedFood.ingredients && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Nguyên liệu:</h3>
                            <ul className="space-y-1">
                              {selectedFood.ingredients.map((ingredient, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  • {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedFood.instructions && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Cách làm:</h3>
                            <ol className="space-y-2">
                              {selectedFood.instructions.map((step, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    {index + 1}.
                                  </span>{" "}
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Continue conversation */}
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                      <div className="flex space-x-2">
                        <Input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Yêu cầu của bạn, tôi sẽ gợi ý ..."
                          className="flex-1 h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none text-center"
                        />
                        <Button type="submit" variant="auth" size="lg" disabled={isLoading}>
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ArrowRight className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MainApp;