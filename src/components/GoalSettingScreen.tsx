import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Target, Plus, Check, Pencil, X } from "lucide-react";

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

  const parseGoalMetrics = (goal: any) => {
    const description = (goal?.description || '').toString();
    const setsMatch = description.match(/(\d+)\s*sets?/i);
    const repsMatch = description.match(/(\d+)\s*reps?/i);
    const weightMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:lb|lbs|pounds?)/i);
    const distanceMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:mi|miles?)/i);
    const durationMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:min|minutes?)/i);

    return {
      sets: setsMatch ? setsMatch[1] : '',
      reps: repsMatch ? repsMatch[1] : '',
      weight: weightMatch ? weightMatch[1] : '',
      distance: distanceMatch ? distanceMatch[1] : '',
      duration: durationMatch ? durationMatch[1] : ''
    };
  };

  const buildGoalDescription = (fields: typeof editFields) => {
    if (fields.category === 'strength') {
      const parts: string[] = [];
      if (fields.weight || fields.reps) {
        const repsText = fields.reps ? `${fields.reps} reps` : '';
        const weightText = fields.weight ? `${fields.weight} lbs` : '';
        const combo = [weightText, repsText].filter(Boolean).join(' x ');
        if (combo) parts.push(combo);
      }
      if (!fields.weight && fields.reps) {
        parts.push(`${fields.reps} reps`);
      }
      if (fields.sets) parts.push(`${fields.sets} sets`);
      if (fields.notes) parts.push(fields.notes);
      return parts.filter(Boolean).join(' • ');
    }

    const cardioParts: string[] = [];
    if (fields.distance) cardioParts.push(`${fields.distance} miles`);
    if (fields.duration) cardioParts.push(`${fields.duration} minutes`);
    if (fields.notes) cardioParts.push(fields.notes);
    return cardioParts.filter(Boolean).join(' • ');
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
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [editFields, setEditFields] = useState({
    title: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    distance: '',
    notes: '',
    targetDate: '',
    category: 'strength' as 'strength' | 'cardio'
  });

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

  const handleOpenEditModal = (goal: any) => {
    const metrics = parseGoalMetrics(goal);
    setEditingGoal(goal);
    setEditFields({
      title: goal.title || '',
      sets: metrics.sets,
      reps: metrics.reps,
      weight: metrics.weight,
      duration: metrics.duration,
      distance: metrics.distance,
      notes: '',
      targetDate: goal.targetDate || new Date().toISOString().split('T')[0],
      category: (goal.category || 'strength') as 'strength' | 'cardio'
    });
  };

  const handleEditFieldChange = (field: keyof typeof editFields, value: string) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const closeEditModal = () => {
    setEditingGoal(null);
  };

  const handleMarkAsCompleted = async (goal: any) => {
    if (!goal) return;

    try {
      // Update goal status to completed
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

  const handleSaveEditedGoal = async () => {
    if (!editingGoal) return;

    const description = buildGoalDescription(editFields);
    const updatedGoal = {
      ...editingGoal,
      title: editFields.title || editingGoal.title,
      description: description || editingGoal.description,
      category: editFields.category,
      targetDate: editFields.targetDate || editingGoal.targetDate
    };

    try {
      const response = await fetch(`http://localhost:8081/api/goals/${editingGoal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal)
      });

      if (response.ok) {
        setMessage(`Goal "${updatedGoal.title}" updated successfully!`);
        setIsSuccess(true);
        closeEditModal();
        if (onGoalAdded) {
          await onGoalAdded();
        }
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      setMessage('Failed to update goal. Please try again.');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteGoal = async () => {
    if (!editingGoal) return;
    if (!confirm(`Delete goal "${editingGoal.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/goals/${editingGoal.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage(`Goal "${editingGoal.title}" deleted.`);
        setIsSuccess(true);
        closeEditModal();
        if (onGoalAdded) {
          await onGoalAdded();
        }
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      setMessage('Failed to delete goal.');
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
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
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

      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="relative w-full max-w-xl bg-white border-2 border-gray-800 p-6">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
              onClick={closeEditModal}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Goal</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Exercise</Label>
                <Input
                  id="edit-title"
                  value={editFields.title}
                  onChange={(e) => handleEditFieldChange('title', e.target.value)}
                  className="border-2 border-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Goal Type</Label>
                <select
                  id="edit-category"
                  value={editFields.category}
                  onChange={(e) => handleEditFieldChange('category', e.target.value as 'strength' | 'cardio')}
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="strength">💪 Strength</option>
                  <option value="cardio">🏃 Cardio</option>
                </select>
              </div>

              {editFields.category === 'strength' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-sets">Sets</Label>
                      <Input
                        id="edit-sets"
                        type="number"
                        value={editFields.sets}
                        onChange={(e) => handleEditFieldChange('sets', e.target.value)}
                        className="border-2 border-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-reps">Reps</Label>
                      <Input
                        id="edit-reps"
                        type="number"
                        value={editFields.reps}
                        onChange={(e) => handleEditFieldChange('reps', e.target.value)}
                        className="border-2 border-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-weight">Weight (lbs)</Label>
                    <Input
                      id="edit-weight"
                      type="number"
                      value={editFields.weight}
                      onChange={(e) => handleEditFieldChange('weight', e.target.value)}
                      className="border-2 border-gray-400"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">Duration (minutes)</Label>
                    <Input
                      id="edit-duration"
                      type="number"
                      value={editFields.duration}
                      onChange={(e) => handleEditFieldChange('duration', e.target.value)}
                      className="border-2 border-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-distance">Distance (miles)</Label>
                    <Input
                      id="edit-distance"
                      type="number"
                      value={editFields.distance}
                      onChange={(e) => handleEditFieldChange('distance', e.target.value)}
                      className="border-2 border-gray-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-target-date">Target Date</Label>
                <Input
                  id="edit-target-date"
                  type="date"
                  value={editFields.targetDate}
                  onChange={(e) => handleEditFieldChange('targetDate', e.target.value)}
                  className="border-2 border-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Input
                  id="edit-notes"
                  value={editFields.notes}
                  onChange={(e) => handleEditFieldChange('notes', e.target.value)}
                  className="border-2 border-gray-400"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={handleSaveEditedGoal}
                  className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleDeleteGoal}
                  className="w-full border-2 border-red-600 bg-white text-red-600 hover:bg-red-50"
                >
                  Delete Goal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
