import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Target, Plus, Check } from "lucide-react";

interface GoalSettingScreenProps {
  onNavigate: (screen: string) => void;
  userData?: any;
  onGoalAdded?: () => void;
}

export function GoalSettingScreen({ onNavigate, userData, onGoalAdded }: GoalSettingScreenProps) {
  const exerciseSuggestions = ['Bench Press', 'Squat', 'Deadlift', 'Run', 'Bike', 'Swim'];
  const [exerciseName, setExerciseName] = useState('');
  const [showGoalSuggestions, setShowGoalSuggestions] = useState(false);
  const getExerciseSuggestions = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return exerciseSuggestions;
    }
    const matches = exerciseSuggestions.filter((exercise) =>
      exercise.toLowerCase().includes(normalized)
    );
    return matches.length > 0 ? matches : exerciseSuggestions;
  };
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [goalCategory, setGoalCategory] = useState<'strength' | 'cardio'>('strength');
  const [targetDate, setTargetDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const resetForm = () => {
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
    setDuration('');
    setNotes('');
    setGoalCategory('strength');
    setTargetDate('');
  };

  const handleMarkAsCompleted = async (goal: any) => {
    if (!goal) return;

    try {
      // Update goal status to completed
      const response = await fetch(`http://localhost:8080/api/goals/${goal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...goal,
          status: 'completed'
        })
      });

      if (response.ok) {
        setMessage(`🎉 Congratulations! Goal "${goal.title}" marked as completed!`);
        setIsSuccess(true);
        
        // Refresh user data to show updated goals
        if (onGoalAdded) {
          await onGoalAdded();
        }
        
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error marking goal as completed:', error);
      setMessage('Failed to update goal');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddGoal = async () => {
    if (!exerciseName.trim()) {
      setMessage('Please enter an exercise name');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!targetDate) {
      setMessage('Please select a target date');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!userData?.id) {
      setMessage('Please log in to add goals');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const trimmedExercise = exerciseName.trim();
    const numericWeight = weight ? parseFloat(weight) : 0;
    const numericReps = reps ? parseInt(reps, 10) : 0;
    const numericDuration = duration ? parseInt(duration, 10) : 0;

    const inferredCategory =
      numericWeight > 0 || numericReps > 0
        ? 'strength'
        : numericDuration > 0
          ? 'cardio'
          : goalCategory;

    if (inferredCategory === 'strength' && numericReps <= 0) {
      setMessage('Please provide a target rep count for strength goals.');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const metricString =
      inferredCategory === 'strength'
        ? numericWeight > 0
          ? `${numericWeight} lbs x ${numericReps} reps`
          : `${numericReps} reps`
        : numericDuration > 0
          ? `${numericDuration} minutes`
          : '';

    const descriptionParts = [
      metricString,
      sets ? `${sets} sets` : '',
      notes ? notes.trim() : '',
    ].filter(Boolean);

    const goalDescription = descriptionParts.join(' • ') || trimmedExercise;

    try {
      const newGoal = {
        title: trimmedExercise,
        description: goalDescription,
        targetDate: targetDate,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        category: inferredCategory,
        targetValue: 100.0,
        currentValue: 0.0,
        unit: '%',
        userId: userData.id
      };

      console.log('Creating goal:', newGoal);

      const response = await fetch('http://localhost:8080/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });

      if (response.status === 409) {
        setMessage('You already have an active goal for this exercise. Complete or deactivate it before creating another.');
        setIsSuccess(false);
        setTimeout(() => setMessage(''), 4000);
        return;
      }

      if (response.ok) {
        const savedGoal = await response.json();
        console.log('Goal created:', savedGoal);
        
        setMessage('Goal added successfully!');
        setIsSuccess(true);
        resetForm();
        
        // Refresh parent data
        if (onGoalAdded) {
          await onGoalAdded();
        }
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to add goal');
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      setMessage('Failed to add goal. Please try again.');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6" />
          <h1 className="text-gray-900">Goals</h1>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded border ${isSuccess ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* New Goal Form */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Set New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-name">Exercise</Label>
              <div className="relative">
                <Input 
                  id="goal-name"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  onFocus={() => setShowGoalSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowGoalSuggestions(false), 100)}
                  placeholder="e.g., Bench Press"
                  className="border-2 border-gray-400"
                />
                {showGoalSuggestions && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 shadow-sm">
                    {getExerciseSuggestions(exerciseName).map((exercise) => (
                        <button
                          key={exercise}
                          type="button"
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setExerciseName(exercise);
                            setShowGoalSuggestions(false);
                          }}
                        >
                          {exercise}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-category">Goal Type</Label>
                <select
                  id="goal-category"
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value as 'strength' | 'cardio')}
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="strength">💪 Strength</option>
                  <option value="cardio">🏃 Cardio</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sets">Sets (optional)</Label>
                <Input
                  id="sets"
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="3"
                  className="border-2 border-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reps">Target Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="5"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Target Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="135"
                  className="border-2 border-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes, optional)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any extra details..."
                  className="border-2 border-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-date">Target Date</Label>
              <Input 
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="border-2 border-gray-400"
              />
            </div>

            <Button 
              onClick={handleAddGoal}
              className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userData?.goals && userData.goals.filter((g: any) => {
                // Only show active goals that are NOT yet completed (< 100%)
                const current = parseFloat(g.currentValue) || 0;
                const target = parseFloat(g.targetValue) || 100;
                const progress = target > 0 ? (current / target) * 100 : 0;
                return g.status === 'active' && progress < 100;
              }).length > 0 ? (
                userData.goals.filter((g: any) => {
                  const current = parseFloat(g.currentValue) || 0;
                  const target = parseFloat(g.targetValue) || 100;
                  const progress = target > 0 ? (current / target) * 100 : 0;
                  return g.status === 'active' && progress < 100;
                }).map((item: any, index: number) => {
                  const current = parseFloat(item.currentValue) || 0;
                  const target = parseFloat(item.targetValue) || 100;
                  const progress = target > 0 ? (current / target) * 100 : 0;
                  
                  console.log(`Active Goal: ${item.title}, Current: ${current}, Target: ${target}, Progress: ${progress}%`);
                  
                  return (
                    <div key={index} className="border border-gray-400 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.title}</p>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                          {item.targetDate && (
                            <p className="text-gray-600 text-sm">Due: {new Date(item.targetDate).toLocaleDateString()}</p>
                          )}
                        </div>
                        <button className="text-gray-600 underline text-sm">Edit</button>
                      </div>
                      <div className="border-2 h-8 mb-2 bg-gray-100 overflow-hidden border-gray-400">
                        <div 
                          className="h-full flex items-center justify-end px-2 transition-all bg-gray-800"
                          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                        >
                          {progress > 5 && (
                            <span className="text-white text-sm font-medium">{Math.round(progress)}%</span>
                          )}
                        </div>
                      </div>
                      {item.targetValue ? (
                        <p className="text-gray-600 text-sm">
                          {current} / {target} {item.unit || ''}
                        </p>
                      ) : (
                        <p className="text-gray-600 text-sm">
                          {Math.round(progress)}% complete
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No active goals yet</p>
                  <p className="text-gray-500 text-sm mt-2">Add your first goal above to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achieved Goals */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Achieved Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userData?.goals && userData.goals.filter((g: any) => {
                // Show goals that are marked as completed OR have reached 100% progress
                const current = parseFloat(g.currentValue) || 0;
                const target = parseFloat(g.targetValue) || 100;
                const progress = target > 0 ? (current / target) * 100 : 0;
                return g.status === 'completed' || (g.status === 'active' && progress >= 100);
              }).length > 0 ? (
                userData.goals.filter((g: any) => {
                  const current = parseFloat(g.currentValue) || 0;
                  const target = parseFloat(g.targetValue) || 100;
                  const progress = target > 0 ? (current / target) * 100 : 0;
                  return g.status === 'completed' || (g.status === 'active' && progress >= 100);
                }).map((item: any, index: number) => {
                  console.log(`Achieved Goal: ${item.title}`);
                  return (
                    <div key={index} className="border border-green-500 p-3 bg-green-50">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.title}</p>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                          <p className="text-green-600 text-sm font-medium mt-1">🎉 Goal Achieved!</p>
                          {item.targetDate && (
                            <p className="text-gray-500 text-xs mt-1">Target date: {new Date(item.targetDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No achieved goals yet</p>
                  <p className="text-gray-500 text-sm mt-2">Keep working towards your active goals!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
