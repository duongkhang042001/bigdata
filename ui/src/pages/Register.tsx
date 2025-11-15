import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { GenderEnum, UserRegister } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import peaPodsImage from "@/assets/pea-pods.png";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Register user
      const registerData: UserRegister = {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        gender: formData.gender as GenderEnum,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
      };

      const user = await authService.register(registerData);

      // Login to get token
      const tokenData = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      toast({
        title: "Đăng ký thành công",
        description: "Chào mừng bạn đến với ứng dụng!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Đăng ký thất bại",
        description: error.response?.data?.detail || "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const renderStepContent = () => {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Đăng ký</h1>
          <p className="text-muted-foreground">
            Tạo tài khoản để sử dụng ứng dụng gợi ý món ăn
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
            className="h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange}
              className="h-12 w-full rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none text-foreground"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Tuổi</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              className="h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none"
              placeholder="25"
              min="1"
              max="150"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Chiều cao (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
              className="h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none"
              placeholder="170"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Cân nặng (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              className="h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none"
              placeholder="60"
              required
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm">
            Lưu mật khẩu
          </Label>
          <button
            type="button"
            onClick={() => navigate("/privacy-policy")}
            className="text-sm text-muted-foreground underline ml-auto hover:text-foreground"
          >
            Chính sách & Điều khoản
          </button>
        </div>
      </div>
    );
  };

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

      {/* Right side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-warm-white">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="space-y-6 p-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}

              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline-auth"
                  onClick={handleBack}
                  className="flex-1"
                >
                  ← QUAY LẠI
                </Button>
                <Button
                  type="submit"
                  variant="auth"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"} →
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;