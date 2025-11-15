import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import peaPodsImage from "@/assets/pea-pods.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn trở lại!",
      });
      navigate(result.redirectTo);
    } catch (error: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: error.response?.data?.detail || "Email hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-warm-white">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="space-y-6 p-0">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Đăng nhập</h1>
              <p className="text-muted-foreground">
                Chào mừng bạn trở lại với ứng dụng gợi ý món ăn
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
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
                <Label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </Label>
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 border border-gray-300"
                />
                <Label htmlFor="remember" className="text-sm">
                  Lưu mật khẩu
                </Label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-muted-foreground underline ml-auto hover:text-foreground"
                >
                  Quên mật khẩu
                </button>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline-auth"
                  onClick={() => navigate("/register")}
                  className="flex-1"
                >
                  ĐĂNG KÝ
                </Button>
                <Button type="submit" variant="auth" className="flex-1" disabled={isLoading}>
                  {isLoading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP →"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;