import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { User } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
  onShowRegistration: () => void;
}

export function LoginScreen({ onLogin, onShowRegistration }: LoginScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-8">
        {/* App Icon/Logo */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 border-2 border-gray-800 rounded-lg flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-gray-900">FitTrack</h1>
          <p className="text-gray-600">Track your fitness journey</p>
        </div>

        {/* Login Form */}
        <div className="border-2 border-gray-800 p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email"
                className="border-2 border-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password"
                className="border-2 border-gray-400"
              />
            </div>
          </div>

          <Button 
            onClick={onLogin}
            className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100"
          >
            Login
          </Button>

          <div className="relative">
            <Separator className="my-4" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-600">
              or
            </span>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline"
              className="w-full border-2 border-gray-400"
            >
              Continue with Google
            </Button>
            <Button 
              variant="outline"
              className="w-full border-2 border-gray-400"
            >
              Continue with Apple
            </Button>
          </div>

          <div className="text-center">
            <button 
              onClick={onShowRegistration}
              className="text-gray-600 underline hover:text-gray-800"
            >
              Create new account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
