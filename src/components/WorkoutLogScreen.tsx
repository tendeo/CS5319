import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Save } from "lucide-react";

interface WorkoutLogScreenProps {
  onNavigate: (screen: string) => void;
}

export function WorkoutLogScreen({ onNavigate }: WorkoutLogScreenProps) {
  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">Log Workout</h1>
          <p className="text-gray-600">Track your exercises</p>
        </div>

        {/* Workout Form */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>New Exercise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input 
                id="exercise-name"
                placeholder="e.g., Bench Press"
                className="border-2 border-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">Sets</Label>
                <Input 
                  id="sets"
                  type="number"
                  placeholder="0"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reps">Reps</Label>
                <Input 
                  id="reps"
                  type="number"
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
                  placeholder="0"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input 
                  id="duration"
                  type="number"
                  placeholder="0"
                  className="border-2 border-gray-400"
                />
              </div>
            </div>

            <Button className="w-full border-2 border-gray-400 bg-white text-gray-900 hover:bg-gray-100">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Exercise
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100 h-12">
          <Save className="w-5 h-5 mr-2" />
          Save Workout
        </Button>

        {/* Recent Entries */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Bench Press", sets: 4, reps: 8, weight: 185 },
                { name: "Squat", sets: 4, reps: 10, weight: 225 },
                { name: "Deadlift", sets: 3, reps: 5, weight: 315 },
                { name: "Overhead Press", sets: 3, reps: 8, weight: 95 },
              ].map((exercise, index) => (
                <div key={index} className="border border-gray-400 p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-900">{exercise.name}</p>
                      <p className="text-gray-600">
                        {exercise.sets}x{exercise.reps} @ {exercise.weight} lbs
                      </p>
                    </div>
                    <button className="text-gray-600 underline">Edit</button>
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
