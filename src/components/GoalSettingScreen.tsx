import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Target, Plus, Check, Pencil } from "lucide-react";

interface GoalSettingScreenProps {
  onNavigate: (screen: string) => void;
  userData?: any;
  onGoalAdded?: () => void;
}

const strengthExercises = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Pull-ups', 'Push-ups'];
const cardioExercises = ['Run', 'Bike', 'Swim', 'Row', 'Walk'];
const exerciseSuggestions = [...strengthExercises, ...cardioExercises];

const inferCategory = (name: string): 'strength' | 'cardio' => {
  const lower = name.trim().toLowerCase();
  if (cardioExercises.some(ex => ex.toLowerCase() === lower)) {
    return 'cardio';
  }
  if (strengthExercises.some(ex => ex.toLowerCase() === lower)) {
    return 'strength';
  }
  return 'strength';
};

export function GoalSettingScreen({ onNavigate, userData, onGoalAdded }: GoalSettingScreenProps) {
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
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');
  const [goalCategory, setGoalCategory] = useState<'strength' | 'cardio'>('strength');
  const [targetDate, setTargetDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExerciseNameChange = (value: string) => {
    setExerciseName(value);
    if (value.trim()) {
      setGoalCategory(inferCategory(value));
    }
  };

  const handleGoalCategoryChange = (value: 'strength' | 'cardio') => {
    setGoalCategory(value);
    if (value === 'strength') {
      setDuration('');
      setDistance('');
    } else {
      setSets('');
      setReps('');
      setWeight('');
    }
  };

  const resetForm = () => {
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
    setDuration('');
    setDistance('');
    setNotes('');
    setGoalCategory('strength');
    setTargetDate('');
  };

  const handleMarkAsCompleted = async (goal: any) => {
    if (!goal) return;

    try {
      const response = await fetch(`http://localhost:8081/api/goals/${goal.id}`, {
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
    const numericDistance = distance ? parseFloat(distance) : 0;

    const inferredCategory =
      goalCategory === 'cardio' || numericDuration > 0 || numericDistance > 0
        ? 'cardio'
        : 'strength';

    if (inferredCategory === 'strength') {
      if (numericReps <= 0) {
        setMessage('Please provide a target rep count for strength goals.');
        setIsSuccess(false);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
    } else {
      if (numericDuration <= 0 && numericDistance <= 0) {
        setMessage('Please provide a target duration or distance for cardio goals.');
        setIsSuccess(false);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
    }

    const metricString =
      inferredCategory === 'strength'
        ? numericWeight > 0
          ? `${numericWeight} lbs x ${numericReps} reps`
          : `${numericReps} reps`
        : (() => {
            const cardioParts: string[] = [];
            if (numericDistance > 0) {
              cardioParts.push(`${numericDistance} miles`);
            }
            if (numericDuration > 0) {
              cardioParts.push(`${numericDuration} minutes`);
            }
            return cardioParts.join(' • ');
          })();

    const descriptionParts = [
      metricString,
      inferredCategory === 'strength' && sets ? `${sets} sets` : '',
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

      const response = await fetch('http://localhost:8081/api/goals', {
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
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6" />
          <h1 className="text-gray-900">Goals</h1>
        </div>

        {message && (
          <div className={`p-3 rounded border ${isSuccess ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {message}
          </div>
        )}

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
                  onChange={(e) => handleExerciseNameChange(e.target.value)}
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
                            handleExerciseNameChange(exercise);
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
                  onChange={(e) => handleGoalCategoryChange(e.target.value as 'strength' | 'cardio')}
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="strength">💪 Strength</option>
                  <option value="cardio">🏃 Cardio</option>
                </select>
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

            {goalCategory === 'strength' && (
              <>
                <div className="grid grid-cols-2 gap-4">
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
              </>
            )}

            {goalCategory === 'cardio' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
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
                  <Label htmlFor="distance">Distance (miles)</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="3"
                    className="border-2 border-gray-400"
                  />
                </div>
              </div>
            )}

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

        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userData?.goals && userData.goals.filter((g: any) => {
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
                  
                  return (
                    <div key={index} className="border border-gray-400 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.title}</p>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                            <button
                              onClick={() => handleMarkAsCompleted(item)}
                              className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </button>
                      </div>
                      <div className="mt-2 border-2 border-gray-400 h-6 bg-white overflow-hidden">
                        <div
                          className="bg-gray-800 h-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                      </div>
                      <p className="text-gray-600 mt-1 text-sm">
                        {`${Math.round(progress)}% complete`}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600">No active goals yet</p>
                  <p className="text-gray-500 text-sm mt-2">Add a new goal to start tracking your progress.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Completed Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userData?.goals && userData.goals.filter((g: any) => g.status === 'completed').length > 0 ? (
                userData.goals.filter((g: any) => g.status === 'completed').map((item: any, index: number) => (
                  <div key={index} className="border border-green-300 bg-green-50 p-3 rounded flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-gray-900 font-medium">{item.title}</p>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">Complete goals to celebrate your achievements!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>What would you like to do?</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => onNavigate('workout')}
              className="border-2 border-gray-400"
            >
              Log Workout
            </Button>
            <Button 
              variant="outline"
              onClick={() => onNavigate('profile')}
              className="border-2 border-gray-400"
            >
              View Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
