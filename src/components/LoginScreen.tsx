import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { User } from "lucide-react";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onShowRegistration: () => void;
}

export function LoginScreen({ onLogin, onShowRegistration }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="border-2 border-gray-800 p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-2 border-gray-400"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-2 border-gray-400"
                disabled={loading}
              />
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
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
              type="button"
              onClick={onShowRegistration}
              className="text-gray-600 underline hover:text-gray-800"
            >
              Create new account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
