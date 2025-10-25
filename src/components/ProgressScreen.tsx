import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp } from "lucide-react";

interface ProgressScreenProps {
  onNavigate: (screen: string) => void;
}

export function ProgressScreen({ onNavigate }: ProgressScreenProps) {
  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          <h1 className="text-gray-900">Progress</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="strength" className="w-full">
          <TabsList className="w-full border-2 border-gray-800 bg-white">
            <TabsTrigger 
              value="strength" 
              className="flex-1 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
            >
              Strength
            </TabsTrigger>
            <TabsTrigger 
              value="bodyweight"
              className="flex-1 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
            >
              Body Weight
            </TabsTrigger>
            <TabsTrigger 
              value="goals"
              className="flex-1 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
            >
              Goals
            </TabsTrigger>
          </TabsList>

          {/* Strength Tab */}
          <TabsContent value="strength" className="space-y-4 mt-6">
            <Card className="border-2 border-gray-800">
              <CardHeader>
                <CardTitle>Total Volume Per Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-gray-400 p-4 h-64">
                  {/* Bar chart wireframe */}
                  <div className="h-full flex items-end justify-between gap-2">
                    {[60, 75, 70, 85, 90, 95].map((height, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gray-800 border border-gray-800"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-gray-600">W{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-center mt-4">Weekly Volume (lbs)</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-800">
              <CardHeader>
                <CardTitle>Exercise Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { exercise: "Bench Press", current: 185, start: 135 },
                    { exercise: "Squat", current: 225, start: 185 },
                    { exercise: "Deadlift", current: 315, start: 275 },
                  ].map((item, index) => (
                    <div key={index} className="border border-gray-400 p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-900">{item.exercise}</span>
                        <span className="text-gray-900">{item.current} lbs</span>
                      </div>
                      <div className="border-2 border-gray-400 h-6">
                        <div 
                          className="bg-gray-800 h-full"
                          style={{ width: `${((item.current - item.start) / item.start) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600 mt-1">Started at {item.start} lbs</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Body Weight Tab */}
          <TabsContent value="bodyweight" className="space-y-4 mt-6">
            <Card className="border-2 border-gray-800">
              <CardHeader>
                <CardTitle>Body Weight Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-gray-400 p-4 h-64 overflow-hidden">
                  <div className="flex items-end h-full pl-10 pr-2">
                    <div className="flex-1 flex flex-col justify-end h-full">
                      <div className="border-l-2 border-b-2 border-gray-800 relative" style={{ height: 'calc(100% - 2rem)' }}>
                        {/* Y-axis labels */}
                        <div className="absolute -left-10 top-0 text-gray-600">190</div>
                        <div className="absolute -left-10 top-1/2 text-gray-600">180</div>
                        <div className="absolute -left-10 bottom-0 text-gray-600">170</div>
                        
                        {/* Line */}
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <polyline
                            points="1,40 20,45 40,42 60,38 80,35 99,32"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-gray-800"
                          />
                        </svg>
                      </div>
                      <div className="flex justify-between mt-2 text-gray-600">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-center mt-4">Weight (lbs)</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4 mt-6">
            <Card className="border-2 border-gray-800">
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { goal: "Bench 225 lbs", progress: 75 },
                    { goal: "Lose 5 lbs", progress: 60 },
                    { goal: "Run 5K under 25 min", progress: 40 },
                  ].map((item, index) => (
                    <div key={index} className="border border-gray-400 p-3">
                      <p className="text-gray-900 mb-2">{item.goal}</p>
                      <div className="border-2 border-gray-400 h-6">
                        <div 
                          className="bg-gray-800 h-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600 mt-1">{item.progress}% complete</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
