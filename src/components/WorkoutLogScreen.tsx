import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Save, X } from "lucide-react";

interface WorkoutLogScreenProps {
  onNavigate: (screen: string) => void;
  userData?: any;
  onWorkoutSaved?: () => void;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
}

export function WorkoutLogScreen({ onNavigate, userData, onWorkoutSaved }: WorkoutLogScreenProps) {
  const exerciseSuggestions = ['Bench Press', 'Squat', 'Deadlift', 'Run', 'Bike', 'Swim'];
  const [exerciseName, setExerciseName] = useState('');
  const [showExerciseSuggestions, setShowExerciseSuggestions] = useState(false);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);

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

    const newExercise: Exercise = {
      name: exerciseName.trim(),
      sets: sets ? parseInt(sets) : 0,
      reps: reps ? parseInt(reps) : 0,
      weight: weight ? parseFloat(weight) : 0,
      duration: duration ? parseInt(duration) : 0,
    };

    setExercises([...exercises, newExercise]);
    
    // Clear form
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
    setDuration('');
    
    setMessage('Exercise added!');
    setIsSuccess(true);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateGoalProgress = async (exerciseName: string) => {
    if (!userData?.goals || userData.goals.length === 0) return;

    // Find goals that match this exercise (case-insensitive)
    const matchingGoals = userData.goals.filter((goal: any) => {
      const goalTitle = goal.title.toLowerCase();
      const exerciseNameLower = exerciseName.toLowerCase();
      // Check if the exercise name is contained in the goal title
      return goal.status === 'active' && (
        goalTitle.includes(exerciseNameLower) || 
        exerciseNameLower.includes(goalTitle)
      );
    });

    console.log(`Found ${matchingGoals.length} matching goals for "${exerciseName}"`);

    // Update each matching goal
    for (const goal of matchingGoals) {
      try {
        // Increase progress by 10 percentage points
        const currentProgress = goal.currentValue || 0;
        const targetValue = goal.targetValue || 100;
        
        // Calculate new current value (10% of target added to current)
        const incrementValue = targetValue * 0.1;
        const newCurrentValue = Math.min(currentProgress + incrementValue, targetValue);
        
        console.log(`Updating goal "${goal.title}": ${currentProgress} → ${newCurrentValue} (target: ${targetValue})`);

        // Update goal in backend
        const response = await fetch(`http://localhost:8080/api/goals/${goal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...goal,
            currentValue: newCurrentValue
          })
        });

        if (response.ok) {
          console.log(`✓ Goal "${goal.title}" updated successfully`);
        } else {
          console.error(`Failed to update goal "${goal.title}"`);
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
      const workout = {
        name: `Workout - ${new Date().toLocaleDateString()}`,
        description: exercises.map(e => `${e.name}: ${e.sets}x${e.reps}${e.weight > 0 ? ` @ ${e.weight}lbs` : ''}`).join(', '),
        type: 'strength',
        duration: exercises.reduce((total, e) => total + e.duration, 0),
        startTime: new Date().toISOString(),
        userId: userData.id
      };

      console.log('Saving workout:', workout);

      // Save to backend
      const response = await fetch('http://localhost:8080/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const savedWorkout = await response.json();
        console.log('Workout saved:', savedWorkout);
        
        // Update goal progress for each exercise
        for (const exercise of exercises) {
          await updateGoalProgress(exercise.name);
        }
        
        setMessage('Workout saved successfully! Goal progress updated.');
        setIsSuccess(true);
        setExercises([]);
        
        // Refresh parent component data to get updated workouts and goals from backend
        if (onWorkoutSaved) {
          await onWorkoutSaved();
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
                  onChange={(e) => setExerciseName(e.target.value)}
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
                            setExerciseName(exercise);
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">Sets</Label>
                <Input 
                  id="sets"
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="0"
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
                  placeholder="0"
                  className="border-2 border-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input 
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input 
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="0"
                  className="border-2 border-gray-400"
                />
              </div>
            </div>

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
                        {exercise.sets > 0 && exercise.reps > 0 && (
                          <span>{exercise.sets}x{exercise.reps}</span>
                        )}
                        {exercise.weight > 0 && (
                          <span> @ {exercise.weight} lbs</span>
                        )}
                        {exercise.duration > 0 && (
                          <span> • {exercise.duration} min</span>
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
            <div className="space-y-3">
              {recentWorkouts && recentWorkouts.length > 0 ? (
                recentWorkouts.slice(0, 5).map((workout: any, index: number) => (
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
