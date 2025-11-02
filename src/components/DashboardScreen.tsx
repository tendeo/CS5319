import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, TrendingUp, Target, Activity } from "lucide-react";
import { ApiTestComponent } from "./ApiTestComponent";

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
  userData?: any;
}

export function DashboardScreen({ onNavigate, userData }: DashboardScreenProps) {
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
              <div className="space-y-2">
                <div className="text-center py-8">
                  <p className="text-gray-600">No recent entries</p>
                  <Button 
                    onClick={() => onNavigate('workout')}
                    className="mt-2 text-sm border border-gray-400 bg-white text-gray-700 hover:bg-gray-100"
                  >
                    Add Your First Entry
                  </Button>
                </div>
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
                  userData.goals.slice(0, 3).map((goal: any, index: number) => (
                    <div key={index}>
                      <p className="text-gray-900">{goal.title || goal.goal}</p>
                      <p className="text-gray-600 text-sm">{goal.description || goal.metric}</p>
                      <div className="mt-2 border-2 border-gray-400 h-6">
                        <div className="bg-gray-800 h-full w-1/4"></div>
                      </div>
                      <p className="text-gray-600 mt-1 text-sm">Getting started</p>
                    </div>
                  ))
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
                <TrendingUp className="w-5 h-5" />
                Body Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="text-gray-600">Weight:</span>
                  <span className="text-gray-900">
                    {userData?.weight ? `${userData.weight} kg` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="text-gray-600">Height:</span>
                  <span className="text-gray-900">
                    {userData?.height ? `${userData.height} cm` : 'Not set'}
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

        {/* Progress Chart */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-gray-400 p-4 h-64 overflow-hidden">
              {/* Simple line chart wireframe */}
              <div className="flex flex-col h-full">
                <div className="flex-1 relative pl-10">
                  <div className="border-l-2 border-b-2 border-gray-800 h-full relative">
                    {/* Y-axis labels */}
                    <div className="absolute -left-10 top-0 text-gray-600">200</div>
                    <div className="absolute -left-10 top-1/2 text-gray-600">150</div>
                    <div className="absolute -left-10 bottom-0 text-gray-600">100</div>
                    
                    {/* Simulated line */}
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polyline
                        points="2,80 20,70 40,65 60,60 80,55 98,50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                        className="text-gray-800"
                      />
                    </svg>
                  </div>
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between mt-2 text-gray-600 pl-10">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-center mt-4">Total Weight Lifted (lbs)</p>
          </CardContent>
        </Card>

        {/* API Test Component */}
        <ApiTestComponent />
      </div>
    </div>
  );
}
