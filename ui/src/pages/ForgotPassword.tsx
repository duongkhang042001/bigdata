import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import peaPodsImage from "@/assets/pea-pods.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send password reset email
    alert("Email khôi phục mật khẩu đã được gửi!");
    navigate("/");
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

      {/* Right side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-warm-white">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="space-y-6 p-0">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Quên mật khẩu</h1>
              <p className="text-muted-foreground">
                Nhập email của bạn để nhận liên kết khôi phục mật khẩu
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-foreground bg-transparent shadow-none"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline-auth"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  QUAY LẠI
                </Button>
                <Button type="submit" variant="auth" className="flex-1">
                  GỬI EMAIL →
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;