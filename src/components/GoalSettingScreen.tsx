import { useState } from "react";
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
  const [goalName, setGoalName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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
    if (!goalName.trim()) {
      setMessage('Please enter a goal description');
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

    try {
      const newGoal = {
        title: goalName.trim(),
        description: goalName.trim(),
        targetDate: targetDate,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        category: 'general',
        targetValue: targetValue ? parseFloat(targetValue) : 100.0,
        currentValue: currentValue ? parseFloat(currentValue) : 0.0,
        unit: targetValue ? 'units' : '%',
        userId: userData.id
      };

      console.log('Creating goal:', newGoal);

      const response = await fetch('http://localhost:8080/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });

      if (response.ok) {
        const savedGoal = await response.json();
        console.log('Goal created:', savedGoal);
        
        setMessage('Goal added successfully!');
        setIsSuccess(true);
        
        // Clear form
        setGoalName('');
        setTargetValue('');
        setCurrentValue('');
        setTargetDate('');
        
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
              <Label htmlFor="goal-name">Goal Description</Label>
              <Input 
                id="goal-name"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Bench Press 225 lbs"
                className="border-2 border-gray-400"
                list="goal-exercise-suggestions"
              />
              <datalist id="goal-exercise-suggestions">
                {exerciseSuggestions.map((exercise) => (
                  <option key={exercise} value={exercise} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-value">Target Value (optional)</Label>
                <Input 
                  id="target-value"
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="225"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-value">Current Value (optional)</Label>
                <Input 
                  id="current-value"
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="185"
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
