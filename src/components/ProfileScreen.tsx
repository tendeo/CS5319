import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User, LogOut, Settings } from "lucide-react";

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <User className="w-6 h-6" />
          <h1 className="text-gray-900">Profile & Settings</h1>
        </div>

        {/* Profile Info */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 border-2 border-gray-800 rounded-full flex items-center justify-center">
                <User className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input 
                id="full-name"
                placeholder="John Doe"
                defaultValue="John Doe"
                className="border-2 border-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="john@example.com"
                defaultValue="john@example.com"
                className="border-2 border-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input 
                  id="weight"
                  type="number"
                  placeholder="180"
                  defaultValue="180"
                  className="border-2 border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input 
                  id="height"
                  placeholder="5'10&quot;"
                  defaultValue="5'10&quot;"
                  className="border-2 border-gray-400"
                />
              </div>
            </div>

            <Button className="w-full border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="units">Unit System</Label>
              <Select defaultValue="imperial">
                <SelectTrigger id="units" className="border-2 border-gray-400">
                  <SelectValue placeholder="Select units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notifications">Notifications</Label>
              <Select defaultValue="all">
                <SelectTrigger id="notifications" className="border-2 border-gray-400">
                  <SelectValue placeholder="Select notification preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="important">Important Only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline"
              className="w-full border-2 border-gray-400"
            >
              Change Password
            </Button>
            <Button 
              variant="outline"
              className="w-full border-2 border-gray-400"
            >
              Privacy Settings
            </Button>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="w-full border-2 border-gray-800 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
