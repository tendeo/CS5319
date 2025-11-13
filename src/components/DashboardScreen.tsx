import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Target, Activity } from "lucide-react";

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
  userData?: any;
}

export function DashboardScreen({ onNavigate, userData }: DashboardScreenProps) {
  const recentWorkouts = Array.isArray(userData?.workouts)
    ? [...userData.workouts].sort((a: any, b: any) => {
        const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
        const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
        if (dateA === dateB) {
          const idA = typeof a.id === 'number' ? a.id : 0;
          const idB = typeof b.id === 'number' ? b.id : 0;
          return idB - idA;
        }
        return dateB - dateA;
      })
    : [];

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {userData?.firstName || 'User'}
          </p>
        </div>

        {/* Add Workout Button */}
        <Button 
          onClick={() => onNavigate('workout')}
          className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100 h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Workout
        </Button>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {recentWorkouts.length > 0 ? (
                  recentWorkouts.slice(0, 3).map((workout: any, index: number) => (
                    <div key={index} className="border border-gray-300 p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-900 font-medium">{workout.name || 'Workout'}</p>
                          <p className="text-gray-600 text-sm">
                            {workout.type && <span className="capitalize">{workout.type} • </span>}
                            {workout.duration ? `${workout.duration} min` : 'Duration not set'}
                          </p>
                          {workout.startTime && (
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(workout.startTime).toLocaleDateString()} at{' '}
                              {new Date(workout.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                          {workout.description && (
                            <p className="text-gray-600 text-sm mt-1">{workout.description}</p>
                          )}
                        </div>
                        <button
                          className="text-gray-600 underline text-sm"
                          onClick={() => onNavigate('workout')}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No recent entries</p>
                    <Button 
                      onClick={() => onNavigate('workout')}
                      className="mt-2 text-sm border border-gray-400 bg-white text-gray-700 hover:bg-gray-100"
                    >
                      Add Your First Entry
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userData?.goals && userData.goals.length > 0 ? (
                  userData.goals.slice(0, 3).map((goal: any, index: number) => {
                    const currentValue =
                      typeof goal.currentValue === 'number'
                        ? goal.currentValue
                        : Number(goal.currentValue) || 0;
                    const targetValue =
                      typeof goal.targetValue === 'number' && goal.targetValue > 0
                        ? goal.targetValue
                        : Number(goal.targetValue) > 0
                          ? Number(goal.targetValue)
                          : 0;
                    const rawPercent = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
                    const progressPercent = Math.max(0, Math.min(100, rawPercent));
                    const unitLabel = goal.unit ? ` ${goal.unit}` : '';

                    return (
                      <div key={index}>
                        <p className="text-gray-900">{goal.title || goal.goal}</p>
                        <p className="text-gray-600 text-sm">{goal.description || goal.metric}</p>
                        <div className="mt-2 border-2 border-gray-400 h-6 bg-white overflow-hidden">
                          <div
                            className="bg-gray-800 h-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <p className="text-gray-600 mt-1 text-sm">
                          {`${Math.round(progressPercent)}% complete${
                            targetValue > 0
                              ? ` (${Math.round(currentValue)} / ${Math.round(targetValue)}${unitLabel})`
                              : ''
                          }`}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <p className="text-gray-600">No goals set yet</p>
                    <Button 
                      onClick={() => onNavigate('goals')}
                      className="mt-2 text-sm border border-gray-400 bg-white text-gray-700 hover:bg-gray-100"
                    >
                      Set Goals
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Body Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="text-gray-600">Weight:</span>
                  <span className="text-gray-900">
                    {userData?.weight ? `${userData.weight} lbs` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="text-gray-600">Height:</span>
                  <span className="text-gray-900">
                    {userData?.height ? `${userData.height} in` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="text-gray-600">Fitness Level:</span>
                  <span className="text-gray-900">
                    {userData?.fitnessLevel ? userData.fitnessLevel.charAt(0).toUpperCase() + userData.fitnessLevel.slice(1) : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="text-gray-600">Gender:</span>
                  <span className="text-gray-900">
                    {userData?.gender || 'Not set'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
