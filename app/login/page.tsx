"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, Mail, UserCheck } from "lucide-react";

// JWT decode function (unchanged)
interface JwtPayload {
  userId: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const body: any = {
      action: isLogin ? "login" : "signup",
      username: form.username,
      password: form.password,
    };

    if (!isLogin) {
      body.email = form.email;
      body.name = form.name;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }

      // Success animation delay before redirect
      setTimeout(() => {
          router.push("/buyers");
      }, 500);

    } catch (err) {
      console.error(err);
      setMessage("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Sign in to your account" : "Start your journey with us"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-400"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Signup Additional Fields */}
            {!isLogin && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-400"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {message && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700 font-medium">{message}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : (
                isLogin ? "Sign in" : "Create account"
              )}
            </button>
          </form>

          {/* Toggle Form */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                  setForm({ username: "", password: "", email: "", name: "" });
                }}
                className="ml-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Secure authentication with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}