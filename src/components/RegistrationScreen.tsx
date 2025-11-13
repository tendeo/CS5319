import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { User, ArrowLeft } from "lucide-react";
import { userApi } from '../services/api';

interface RegistrationScreenProps {
  onBack: () => void;
  onLogin: () => void;
}

export function RegistrationScreen({ onBack, onLogin }: RegistrationScreenProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    fitnessLevel: '',
    // Fitness Goals
    strengthGoals: [] as string[],
    cardioGoals: [] as string[],
    weightGoals: [] as string[],
    flexibilityGoals: [] as string[],
    nutritionGoals: [] as string[],
    customGoals: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalToggle = (category: string, goal: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].includes(goal)
        ? (prev[category as keyof typeof prev] as string[]).filter(g => g !== goal)
        : [...(prev[category as keyof typeof prev] as string[]), goal]
    }));
  };

  const handleCustomGoalAdd = (category: string, goal: string) => {
    if (goal.trim()) {
      setFormData(prev => ({
        ...prev,
        [category]: [...(prev[category as keyof typeof prev] as string[]), goal.trim()]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        fitnessLevel: formData.fitnessLevel || null,
        // Include selected goals
        selectedGoals: {
          strength: formData.strengthGoals,
          cardio: formData.cardioGoals,
          weight: formData.weightGoals,
          flexibility: formData.flexibilityGoals,
          nutrition: formData.nutritionGoals,
          custom: formData.customGoals
        }
      };

      console.log('Creating user with data:', userData);
      const createdUser = await userApi.create(userData);
      console.log('User created successfully:', createdUser);
      
      setSuccess('Account created successfully! You can now login.');
      setTimeout(() => {
        onLogin();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 border-2 border-gray-800 rounded-lg flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-gray-900">Create Account</h1>
          <p className="text-gray-600">Join FitTrack today</p>
        </div>

        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full border-2 border-gray-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="border-2 border-gray-800 p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="border-2 border-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="johndoe"
                className="border-2 border-gray-400"
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
                placeholder="john@example.com"
                className="border-2 border-gray-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="border-2 border-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="border-2 border-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Fitness Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Fitness Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input 
                id="dateOfBirth" 
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="border-2 border-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select 
                id="gender" 
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border-2 border-gray-400 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (in)</Label>
                <Input 
                  id="height" 
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="70"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input 
                  id="weight" 
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="180"
                  className="border-2 border-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fitnessLevel">Fitness Level</Label>
              <select 
                id="fitnessLevel" 
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleInputChange}
                className="w-full p-2 border-2 border-gray-400 rounded-md"
              >
                <option value="">Select Fitness Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <Separator />

          {/* Fitness Goals Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Fitness Goals</h3>
            <p className="text-sm text-gray-600">Select your fitness goals to get personalized recommendations</p>
            
            {/* Strength Goals */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">💪 Strength Goals</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Bench Press 225 lbs',
                  'Squat 315 lbs', 
                  'Deadlift 405 lbs',
                  'Overhead Press 135 lbs',
                  'Pull-ups (10 reps)',
                  'Push-ups (50 reps)',
                  'Plank (2 minutes)',
                  'Muscle-ups (5 reps)'
                ].map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.strengthGoals.includes(goal)}
                      onChange={() => handleGoalToggle('strengthGoals', goal)}
                      className="rounded border-gray-400"
                    />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cardio Goals */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">🏃 Cardio Goals</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Run 5K',
                  'Run 10K',
                  'Run Half Marathon',
                  'Run Marathon',
                  'Bike 20 miles',
                  'Swim 1 mile',
                  'Row 2000m',
                  'HIIT 30 minutes'
                ].map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.cardioGoals.includes(goal)}
                      onChange={() => handleGoalToggle('cardioGoals', goal)}
                      className="rounded border-gray-400"
                    />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Weight Goals */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">⚖️ Weight Goals</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Lose 10 lbs',
                  'Lose 20 lbs',
                  'Lose 30 lbs',
                  'Gain 10 lbs',
                  'Gain 20 lbs',
                  'Maintain weight',
                  'Build muscle',
                  'Lose fat'
                ].map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.weightGoals.includes(goal)}
                      onChange={() => handleGoalToggle('weightGoals', goal)}
                      className="rounded border-gray-400"
                    />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Flexibility Goals */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">🧘 Flexibility Goals</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Touch toes',
                  'Splits',
                  'Bridge pose',
                  'Headstand',
                  'Handstand',
                  'Yoga practice',
                  'Stretching routine',
                  'Mobility improvement'
                ].map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.flexibilityGoals.includes(goal)}
                      onChange={() => handleGoalToggle('flexibilityGoals', goal)}
                      className="rounded border-gray-400"
                    />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nutrition Goals */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">🥗 Nutrition Goals</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Eat more protein',
                  'Reduce sugar',
                  'Drink more water',
                  'Eat more vegetables',
                  'Meal prep',
                  'Track calories',
                  'Intermittent fasting',
                  'Balanced diet'
                ].map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.nutritionGoals.includes(goal)}
                      onChange={() => handleGoalToggle('nutritionGoals', goal)}
                      className="rounded border-gray-400"
                    />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Goals */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">🎯 Custom Goals</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add your custom goal..."
                    className="border-2 border-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        handleCustomGoalAdd('customGoals', input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                      if (input) {
                        handleCustomGoalAdd('customGoals', input.value);
                        input.value = '';
                      }
                    }}
                    className="border-2 border-gray-400"
                  >
                    Add
                  </Button>
                </div>
                {formData.customGoals.length > 0 && (
                  <div className="space-y-1">
                    {formData.customGoals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{goal}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              customGoals: prev.customGoals.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <Button 
            type="submit"
            disabled={loading}
            className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}