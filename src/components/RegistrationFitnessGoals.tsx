import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Target, ArrowLeft, Check } from "lucide-react";
import { userApi } from '../services/api';

interface RegistrationFitnessGoalsProps {
  onBack: () => void;
  onComplete: (userData: any) => void;
  previousData: any;
}

export function RegistrationFitnessGoals({ onBack, onComplete, previousData }: RegistrationFitnessGoalsProps) {
  const [formData, setFormData] = useState({
    goals: [] as any[]
  });
  const [goalInput, setGoalInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('strength');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [customMetric, setCustomMetric] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [distanceInput, setDistanceInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGoalAdd = () => {
    if (selectedGoal) {
      let metric = '';
      
      if (selectedCategory === 'strength' && weightInput.trim() && repsInput.trim()) {
        metric = `${weightInput.trim()} lbs x ${repsInput.trim()} reps`;
      } else if (selectedCategory === 'cardio' && distanceInput.trim() && timeInput.trim()) {
        metric = `${distanceInput.trim()} in ${timeInput.trim()}`;
      } else {
        return; // Don't add if required fields are missing
      }

      const goalObject = {
        category: selectedCategory,
        goal: selectedGoal,
        metric: metric,
        id: Date.now() // Simple ID for React key
      };
      
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, goalObject]
      }));
      
      // Reset all inputs
      setSelectedGoal('');
      setWeightInput('');
      setRepsInput('');
      setDistanceInput('');
      setTimeInput('');
    }
  };

  const handleGoalRemove = (goalId: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
  };

  const handleDropdownSelect = (goal: string) => {
    setSelectedGoal(goal);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userData = {
        ...previousData,
        // Store goals as a simple array
        goals: formData.goals
      };

      const createdUser = await userApi.create(userData);
      console.log('User created successfully:', createdUser);
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Redirect to login after a short delay, passing the created user data from backend
      setTimeout(() => {
        onComplete(createdUser);
      }, 2000);

    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create account. Please try again.');
    }
    setLoading(false);
  };

  const getGoalOptions = (category: string) => {
    switch (category) {
      case 'strength':
        return [
          'Bench Press',
          'Squat', 
          'Deadlift',
          'Overhead Press',
          'Pull-ups',
          'Push-ups',
          'Plank',
          'Muscle-ups',
          'Dips',
          'Lunges'
        ];
      case 'cardio':
        return [
          'Run',
          'Bike',
          'Swim',
          'Row',
          'HIIT',
          'Cycling',
          'Elliptical'
        ];
      default:
        return [];
    }
  };

  const getMetricPlaceholder = (category: string, goal: string) => {
    switch (category) {
      case 'strength':
        return 'e.g., 250 lbs x 10 reps';
      case 'cardio':
        return 'e.g., 3.1 miles in 25 minutes';
      default:
        return 'Enter your target metric';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 border-2 border-gray-800 rounded-lg flex items-center justify-center">
            <Target className="w-8 h-8" />
          </div>
          <h1 className="text-gray-900">Fitness Goals</h1>
          <p className="text-gray-600">Step 3 of 3: Set your fitness goals</p>
        </div>

        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full border-2 border-gray-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Fitness Info
        </Button>

        {/* Fitness Goals Form */}
        <div className="border-2 border-gray-800 p-6 space-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Set Your Fitness Goals</h3>
            <p className="text-sm text-gray-600">Add your personal fitness goals. You can type your own or select from suggestions.</p>
            
            {/* Goal Category Selection */}
            <div className="space-y-3">
              <Label htmlFor="category">Goal Category</Label>
              <select 
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="strength">💪 Strength</option>
                <option value="cardio">🏃 Cardio</option>
              </select>
            </div>

            {/* Goal Selection */}
            <div className="space-y-3">
              <Label htmlFor="goalSelect">Select Goal</Label>
              <select 
                id="goalSelect"
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Choose a goal...</option>
                {getGoalOptions(selectedCategory).map((goal, index) => (
                  <option key={index} value={goal}>{goal}</option>
                ))}
              </select>
            </div>

            {/* Metric Input */}
            {selectedGoal && (
              <div className="space-y-3">
                {selectedCategory === 'strength' && (
                  <>
                    <Label>Weight & Reps</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={weightInput}
                          onChange={(e) => setWeightInput(e.target.value)}
                          placeholder="Weight (lbs)"
                          className="border-2 border-gray-400"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={repsInput}
                          onChange={(e) => setRepsInput(e.target.value)}
                          placeholder="Reps"
                          className="border-2 border-gray-400"
                        />
                      </div>
                      <Button 
                        onClick={handleGoalAdd}
                        className="border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100"
                      >
                        Add Goal
                      </Button>
                    </div>
                  </>
                )}
                
                {selectedCategory === 'cardio' && (
                  <>
                    <Label>Distance & Time</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={distanceInput}
                          onChange={(e) => setDistanceInput(e.target.value)}
                          placeholder="Distance (miles)"
                          className="border-2 border-gray-400"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={timeInput}
                          onChange={(e) => setTimeInput(e.target.value)}
                          placeholder="Time (minutes)"
                          className="border-2 border-gray-400"
                        />
                      </div>
                      <Button 
                        onClick={handleGoalAdd}
                        className="border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100"
                      >
                        Add Goal
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Current Goals List */}
            {formData.goals.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Your Goals ({formData.goals.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.goals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 border-2 border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">
                            {goal.category.toUpperCase()}
                          </span>
                          <span className="font-medium text-sm">{goal.goal}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {goal.category === 'strength' && `Weight & Reps: ${goal.metric}`}
                          {goal.category === 'cardio' && `Distance & Time: ${goal.metric}`}
                        </div>
                      </div>
                      <button
                        onClick={() => handleGoalRemove(goal.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={onBack}
              className="flex-1 border-2 border-gray-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}