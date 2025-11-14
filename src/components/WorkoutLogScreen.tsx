import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Save, X } from "lucide-react";

interface WorkoutLogScreenProps {
  onNavigate: (screen: string) => void;
  userData?: any;
  onWorkoutSaved?: (updatedGoals?: Record<number, { currentValue: number; status: string }>) => void | Promise<void>;
}

interface Exercise {
  name: string;
  category: 'strength' | 'cardio';
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  distance: number;
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

export function WorkoutLogScreen({ onNavigate, userData, onWorkoutSaved }: WorkoutLogScreenProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState<'strength' | 'cardio'>('strength');
  const [showExerciseSuggestions, setShowExerciseSuggestions] = useState(false);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);

  const handleExerciseNameChange = (value: string) => {
    setExerciseName(value);
    if (value.trim()) {
      setExerciseCategory(inferCategory(value));
    }
  };

  const handleCategoryChange = (value: 'strength' | 'cardio') => {
    setExerciseCategory(value);
    if (value === 'strength') {
      setDuration('');
      setDistance('');
    } else {
      setSets('');
      setReps('');
      setWeight('');
    }
  };

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

  // Update recent workouts when userData changes
  useEffect(() => {
    if (userData?.workouts && Array.isArray(userData.workouts)) {
      setRecentWorkouts([...userData.workouts]);
    } else {
      setRecentWorkouts([]);
    }
  }, [userData]);

  const handleAddExercise = () => {
    if (!exerciseName.trim()) {
      setMessage('Please enter an exercise name');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (exerciseCategory === 'strength') {
      if (!sets || !reps) {
        setMessage('Please enter sets and reps for strength exercises');
        setIsSuccess(false);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
    } else {
      if (!duration && !distance) {
        setMessage('Please enter duration or distance for cardio exercises');
        setIsSuccess(false);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
    }

    const newExercise: Exercise = {
      name: exerciseName.trim(),
      category: exerciseCategory,
      sets: exerciseCategory === 'strength' ? (sets ? parseInt(sets, 10) : 0) : 0,
      reps: exerciseCategory === 'strength' ? (reps ? parseInt(reps, 10) : 0) : 0,
      weight: exerciseCategory === 'strength' ? (weight ? parseFloat(weight) : 0) : 0,
      duration: exerciseCategory === 'cardio' ? (duration ? parseInt(duration, 10) : 0) : 0,
      distance: exerciseCategory === 'cardio' ? (distance ? parseFloat(distance) : 0) : 0,
    };

    setExercises([...exercises, newExercise]);
    
    // Clear form
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
    setDuration('');
    setDistance('');
    setExerciseCategory('strength');
    
    setMessage('Exercise added!');
    setIsSuccess(true);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const clampPercentage = (value: number) => Math.max(0, Math.min(100, value));

  const parseStrengthGoalTargets = (goal: any) => {
    const description = (goal?.description || goal?.metric || '').toString();
    let targetWeight = 0;
    let targetReps = 0;

    const weightThenRepsMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:lb|lbs|pounds?)\s*(?:x|\*)\s*(\d+)/i);
    if (weightThenRepsMatch) {
      targetWeight = parseFloat(weightThenRepsMatch[1]);
      targetReps = parseInt(weightThenRepsMatch[2], 10);
    }

    const repsThenWeightMatch = description.match(/(\d+)\s*(?:reps?)\s*@?\s*(\d+(?:\.\d+)?)\s*(?:lb|lbs|pounds?)/i);
    if (repsThenWeightMatch) {
      if (!targetReps) {
        targetReps = parseInt(repsThenWeightMatch[1], 10);
      }
      if (!targetWeight) {
        targetWeight = parseFloat(repsThenWeightMatch[2]);
      }
    }

    if (!targetReps) {
      const repsOnlyMatch = description.match(/(\d+)\s*(?:reps?)/i);
      if (repsOnlyMatch) {
        targetReps = parseInt(repsOnlyMatch[1], 10);
      }
    }

    return {
      targetWeight: Number.isFinite(targetWeight) ? targetWeight : 0,
      targetReps: Number.isFinite(targetReps) ? targetReps : 0
    };
  };

const parseCardioGoalTargets = (goal: any) => {
  const description = (goal?.description || goal?.metric || '').toString();
  const distanceMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:mi|miles)\b/i);
  const durationMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:min|minutes)\b/i);

  return {
    targetDistance: distanceMatch ? parseFloat(distanceMatch[1]) : 0,
    targetDuration: durationMatch ? parseFloat(durationMatch[1]) : 0,
  };
};

const formatNumber = (value: number, digits = 2) => {
  if (!Number.isFinite(value)) return '0';
  if (Math.abs(value - Math.round(value)) < 1e-3) {
    return Math.round(value).toString();
  }
  return value.toFixed(digits).replace(/\.?0+$/, '');
};

  const updateGoalProgress = async (
    exercise: Exercise,
    progressCache: Record<number, number>,
    progressSummaries: string[],
    goalUpdates: Record<number, { currentValue: number; status: string }>
  ) => {
    if (exercise.category !== 'strength') {
      return;
    }
    if (!userData?.goals || userData.goals.length === 0) return;

    // Find goals that match this exercise (case-insensitive)
    const matchingGoals = userData.goals.filter((goal: any) => {
      const goalTitle = goal.title.toLowerCase();
      const exerciseNameLower = exercise.name.toLowerCase();
      const goalCategory = (goal.category || '').toLowerCase();
      const sameCategory = goalCategory && goalCategory === exercise.category;

      // Check if exercise name is contained in the goal title or the categories align
      return goal.status === 'active' && (
        goalTitle.includes(exerciseNameLower) || 
        exerciseNameLower.includes(goalTitle) ||
        sameCategory
      );
    });

    console.log(`Found ${matchingGoals.length} matching goals for "${exercise.name}"`);

    // Update each matching goal
    for (const goal of matchingGoals) {
      try {
        const goalCategory = (goal.category || '').toLowerCase();

        if (goalCategory === 'cardio') {
          const { targetDistance, targetDuration } = parseCardioGoalTargets(goal);
          const actualDistance = Number.isFinite(exercise.distance) && exercise.distance > 0 ? exercise.distance : 0;
          const actualDuration = Number.isFinite(exercise.duration) && exercise.duration > 0 ? exercise.duration : 0;

          if (targetDistance <= 0 && targetDuration <= 0) {
            console.warn(`Unable to determine targets for cardio goal "${goal.title}". Skipping update.`);
            continue;
          }

          const distanceRatio =
            targetDistance > 0
              ? Math.min(1, Math.max(0, actualDistance / targetDistance))
              : null;
          const durationRatio =
            targetDuration > 0
              ? Math.min(1, Math.max(0, actualDuration / targetDuration))
              : null;

          const measuredRatios = [distanceRatio, durationRatio].filter(
            (ratio): ratio is number => ratio !== null
          );

          if (measuredRatios.length === 0) {
            console.warn(`No measurable progress metrics for cardio goal "${goal.title}". Skipping update.`);
            continue;
          }

          const limitingRatio = Math.min(...measuredRatios);
          const progressPercent = clampPercentage(limitingRatio * 100);
          const previousBest =
            progressCache?.[goal.id] ??
            (typeof goal.currentValue === 'number' ? clampPercentage(goal.currentValue) : 0);

          const newCurrentValue = Math.max(previousBest, progressPercent);
          const nextStatus = newCurrentValue >= 100 ? 'completed' : goal.status;
          progressCache[goal.id] = newCurrentValue;
          goalUpdates[goal.id] = { currentValue: newCurrentValue, status: nextStatus };

          console.log(
            `Updating cardio goal "${goal.title}": ${formatNumber(actualDistance)} mi, ${formatNumber(actualDuration)} min → ${newCurrentValue}%`
          );

          if (newCurrentValue > previousBest) {
            const distanceSummary =
              targetDistance > 0
                ? `${formatNumber(actualDistance)} / ${formatNumber(targetDistance)} mi`
                : actualDistance > 0
                  ? `${formatNumber(actualDistance)} mi`
                  : '';
            const durationSummary =
              targetDuration > 0
                ? `${formatNumber(actualDuration)} / ${formatNumber(targetDuration)} min`
                : actualDuration > 0
                  ? `${formatNumber(actualDuration)} min`
                  : '';

            let feedback = '';
            if (newCurrentValue < 100) {
              if (distanceRatio !== null && (durationRatio === null || distanceRatio < durationRatio)) {
                feedback = ' (add distance)';
              } else if (durationRatio !== null && (distanceRatio === null || durationRatio <= distanceRatio)) {
                feedback = ' (add time)';
              }
            } else {
              feedback = ' (achieved!)';
            }

            const cardioSummary = [distanceSummary, durationSummary].filter(Boolean).join(' • ');
            progressSummaries.push(
              `${goal.title}: ${cardioSummary} — ${Math.round(newCurrentValue)}% of goal${feedback}`
            );
          }

          const response = await fetch(`http://localhost:8081/api/goals/${goal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...goal,
              currentValue: newCurrentValue,
              status: nextStatus
            })
          });

          if (response.ok) {
            console.log(`✓ Cardio goal "${goal.title}" updated successfully`);
          } else {
            console.error(`Failed to update cardio goal "${goal.title}"`);
          }
        } else {
          const { targetWeight, targetReps } = parseStrengthGoalTargets(goal);
          const bestReps = Number.isFinite(exercise.reps) && exercise.reps > 0 ? exercise.reps : 0;
          const bestWeight = Number.isFinite(exercise.weight) && exercise.weight > 0 ? exercise.weight : 0;

          if (targetReps <= 0 && targetWeight <= 0) {
            console.warn(`Unable to determine targets for goal "${goal.title}". Skipping update.`);
            continue;
          }

          const repsRatio =
            targetReps > 0 && bestReps > 0 ? Math.min(1, clampPercentage((bestReps / targetReps) * 100) / 100) : 0;

          let weightRatio = 1;
          if (targetWeight > 0) {
            weightRatio =
              bestWeight > 0 ? Math.min(1, clampPercentage((bestWeight / targetWeight) * 100) / 100) : 0;
          }

          const limitingRatio =
            targetReps > 0 && targetWeight > 0
              ? Math.min(repsRatio, weightRatio)
              : targetReps > 0
                ? repsRatio
                : weightRatio;
          const progressPercent = clampPercentage(limitingRatio * 100);
          const previousBest =
            progressCache?.[goal.id] ??
            (typeof goal.currentValue === 'number' ? clampPercentage(goal.currentValue) : 0);

          const newCurrentValue = Math.max(previousBest, progressPercent);
          const nextStatus = newCurrentValue >= 100 ? 'completed' : goal.status;
          progressCache[goal.id] = newCurrentValue;
          goalUpdates[goal.id] = { currentValue: newCurrentValue, status: nextStatus };

          console.log(
            `Updating goal "${goal.title}": best set ${bestReps} reps @ ${bestWeight} lbs → ${newCurrentValue}%`
          );

          if (newCurrentValue > previousBest) {
            const weightDescriptor =
              bestWeight > 0 ? `${bestReps}-rep @ ${bestWeight} lb` : `${bestReps} reps (bodyweight)`;

            let feedback = '';
            if (newCurrentValue < 100) {
              if (targetReps > 0 && limitingRatio === repsRatio && repsRatio < 1) {
                feedback = ' (add reps)';
              } else if (targetWeight > 0 && limitingRatio === weightRatio && weightRatio < 1) {
                feedback = ' (add weight)';
              }
            }

            progressSummaries.push(
              `${goal.title}: best ${weightDescriptor} — ${Math.round(newCurrentValue)}% of goal${feedback}`
            );
          }

          const response = await fetch(`http://localhost:8081/api/goals/${goal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...goal,
              currentValue: newCurrentValue,
              status: nextStatus
            })
          });

          if (response.ok) {
            console.log(`✓ Goal "${goal.title}" updated successfully`);
          } else {
            console.error(`Failed to update goal "${goal.title}"`);
          }
        }
      } catch (error) {
        console.error(`Error updating goal "${goal.title}":`, error);
      }
    }
  };

  const handleSaveWorkout = async () => {
    if (exercises.length === 0) {
      setMessage('Please add at least one exercise before saving');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!userData?.id) {
      setMessage('Please log in to save workouts');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      // Create workout object
      const hasStrength = exercises.some(e => e.category === 'strength');
      const hasCardio = exercises.some(e => e.category === 'cardio');
      const workoutType = hasStrength && hasCardio ? 'mixed' : hasCardio ? 'cardio' : 'strength';

      const workoutDescription = exercises.map((e) => {
        if (e.category === 'strength') {
          const volume = e.sets > 0 && e.reps > 0 ? `${e.sets}x${e.reps}` : '';
          const load = e.weight > 0 ? `${e.weight} lbs` : '';
          const detail = volume && load ? `${volume} @ ${load}` : volume || load;
          return detail ? `${e.name}: ${detail}` : e.name;
        }
        const parts: string[] = [];
        if (e.distance > 0) {
          parts.push(`${e.distance} mi`);
        }
        if (e.duration > 0) {
          parts.push(`${e.duration} min`);
        }
        const detail = parts.join(' • ');
        return detail ? `${e.name}: ${detail}` : e.name;
      }).join(', ');

      const workout = {
        name: `Workout - ${new Date().toLocaleDateString()}`,
        description: workoutDescription,
        type: workoutType,
        duration: exercises.reduce((total, e) => total + (e.duration || 0), 0),
        startTime: new Date().toISOString(),
        userId: userData.id
      };

      console.log('Saving workout:', workout);

      // Save to backend
      const response = await fetch('http://localhost:8081/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const savedWorkout = await response.json();
        console.log('Workout saved:', savedWorkout);
        
        // Update goal progress for each exercise
        const goalProgressCache: Record<number, number> = {};
        const progressSummaries: string[] = [];
        const goalUpdates: Record<number, { currentValue: number; status: string }> = {};
        for (const exercise of exercises) {
          await updateGoalProgress(exercise, goalProgressCache, progressSummaries, goalUpdates);
        }
        
        setMessage(
          progressSummaries.length > 0
            ? `Workout saved! ${progressSummaries.join(' • ')}`
            : 'Workout saved successfully! Goal progress updated.'
        );
        setIsSuccess(true);
        setExercises([]);
        
        // Refresh parent component data to get updated workouts and goals from backend
        if (onWorkoutSaved) {
          await onWorkoutSaved(Object.keys(goalUpdates).length > 0 ? goalUpdates : undefined);
        }
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorText = await response.text();
        console.error('Save failed:', response.status, errorText);
        throw new Error(`Failed to save workout: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      setMessage('Failed to save workout. Check console for details.');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">Log Workout</h1>
          <p className="text-gray-600">Track your exercises</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded border ${isSuccess ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Workout Form */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>New Exercise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <div className="relative">
                <Input 
                  id="exercise-name"
                  value={exerciseName}
                  onChange={(e) => handleExerciseNameChange(e.target.value)}
                  onFocus={() => setShowExerciseSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowExerciseSuggestions(false), 100)}
                  placeholder="e.g., Bench Press"
                  className="border-2 border-gray-400"
                />
                {showExerciseSuggestions && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 shadow-sm">
                    {getExerciseSuggestions(exerciseName).map((exercise) => (
                        <button
                          key={exercise}
                          type="button"
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleExerciseNameChange(exercise);
                            setShowExerciseSuggestions(false);
                          }}
                        >
                          {exercise}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise-category">Exercise Type</Label>
              <select
                id="exercise-category"
                value={exerciseCategory}
                onChange={(e) => handleCategoryChange(e.target.value as 'strength' | 'cardio')}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="strength">Strength (sets • reps • weight)</option>
                <option value="cardio">Cardio (duration • distance)</option>
              </select>
            </div>

            {exerciseCategory === 'strength' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sets">Sets</Label>
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
                    <Label htmlFor="reps">Reps</Label>
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
                  <Label htmlFor="weight">Weight (lbs)</Label>
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

            {exerciseCategory === 'cardio' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
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
                  <Label htmlFor="distance">Distance (mi)</Label>
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

            <Button 
              onClick={handleAddExercise}
              className="w-full border-2 border-gray-400 bg-white text-gray-900 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Exercise to Workout
            </Button>
          </CardContent>
        </Card>

        {/* Current Workout */}
        {exercises.length > 0 && (
          <Card className="border-2 border-gray-800 bg-gray-50">
            <CardHeader>
              <CardTitle>Current Workout ({exercises.length} exercise{exercises.length !== 1 ? 's' : ''})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exercises.map((exercise, index) => (
                  <div key={index} className="flex justify-between items-center bg-white border border-gray-400 p-3 rounded">
                    <div>
                      <p className="text-gray-900 font-medium">{exercise.name}</p>
                      <p className="text-gray-600 text-sm">
                        {exercise.category === 'strength' ? (
                          <>
                            {exercise.sets > 0 && exercise.reps > 0 && (
                              <span>{exercise.sets}x{exercise.reps}</span>
                            )}
                            {exercise.weight > 0 && (
                              <span>{exercise.sets > 0 && exercise.reps > 0 ? ' @ ' : ''}{exercise.weight} lbs</span>
                            )}
                          </>
                        ) : (
                          <>
                            {exercise.distance > 0 && (
                              <span>{exercise.distance} mi</span>
                            )}
                            {exercise.duration > 0 && (
                              <span>{exercise.distance > 0 ? ' • ' : ''}{exercise.duration} min</span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveExercise(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <Button 
          onClick={handleSaveWorkout}
          disabled={exercises.length === 0}
          className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Workout {exercises.length > 0 && `(${exercises.length} exercise${exercises.length !== 1 ? 's' : ''})`}
        </Button>

        {/* Recent Workouts */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {recentWorkouts && recentWorkouts.length > 0 ? (
                recentWorkouts.map((workout: any, index: number) => (
                  <div key={index} className="border border-gray-400 p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-900 font-medium">{workout.name}</p>
                        <p className="text-gray-600 text-sm">
                          {workout.type && <span className="capitalize">{workout.type} • </span>}
                          {workout.duration && <span>{workout.duration} min</span>}
                          {workout.caloriesBurned && <span> • {workout.caloriesBurned} cal</span>}
                        </p>
                        {workout.startTime && (
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(workout.startTime).toLocaleDateString()} at {new Date(workout.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                        {workout.description && (
                          <p className="text-gray-600 text-sm mt-1">{workout.description}</p>
                        )}
                      </div>
                      <button className="text-gray-600 underline text-sm">Edit</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No recent workouts</p>
                  <p className="text-gray-500 text-sm mt-2">Start by adding your first workout above!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
