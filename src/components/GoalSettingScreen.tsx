import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Target, Plus, Check } from "lucide-react";

interface GoalSettingScreenProps {
  onNavigate: (screen: string) => void;
}

export function GoalSettingScreen({ onNavigate }: GoalSettingScreenProps) {
  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6" />
          <h1 className="text-gray-900">Goals</h1>
        </div>

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
                placeholder="e.g., Bench Press 225 lbs"
                className="border-2 border-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-value">Target Value</Label>
                <Input 
                  id="target-value"
                  type="number"
                  placeholder="225"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-value">Current Value</Label>
                <Input 
                  id="current-value"
                  type="number"
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
                className="border-2 border-gray-400"
              />
            </div>

            <Button className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100">
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
              {[
                { goal: "Bench Press 225 lbs", current: 185, target: 225, deadline: "Dec 31, 2025" },
                { goal: "Lose 5 lbs", current: 3, target: 5, deadline: "Nov 15, 2025" },
                { goal: "Squat 315 lbs", current: 225, target: 315, deadline: "Jan 1, 2026" },
              ].map((item, index) => (
                <div key={index} className="border border-gray-400 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-gray-900">{item.goal}</p>
                      <p className="text-gray-600">Due: {item.deadline}</p>
                    </div>
                    <button className="text-gray-600 underline">Edit</button>
                  </div>
                  <div className="border-2 border-gray-400 h-8 mb-2">
                    <div 
                      className="bg-gray-800 h-full flex items-center justify-end px-2"
                      style={{ width: `${(item.current / item.target) * 100}%` }}
                    >
                      <span className="text-white">{Math.round((item.current / item.target) * 100)}%</span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {item.current} / {item.target}
                  </p>
                </div>
              ))}
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
              {[
                { goal: "Deadlift 315 lbs", date: "Sep 15, 2025" },
                { goal: "Run 5K", date: "Aug 10, 2025" },
                { goal: "Lose 10 lbs", date: "Jul 1, 2025" },
              ].map((item, index) => (
                <div key={index} className="border border-gray-400 p-3 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gray-900" />
                    <div className="flex-1">
                      <p className="text-gray-900">{item.goal}</p>
                      <p className="text-gray-600">Completed: {item.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
