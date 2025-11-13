import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User, LogOut, Settings } from "lucide-react";

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  userData?: any;
}

export function ProfileScreen({ onNavigate, onLogout, userData }: ProfileScreenProps) {
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
                placeholder="Enter your name"
                value={`${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'Not set'}
                className="border-2 border-gray-400"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="Enter your email"
                value={userData?.email || 'Not set'}
                className="border-2 border-gray-400"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                placeholder="Enter your username"
                value={userData?.username || 'Not set'}
                className="border-2 border-gray-400"
                readOnly
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input 
                  id="weight"
                  type="number"
                  placeholder="Not set"
                  value={userData?.weight || ''}
                  className="border-2 border-gray-400"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (in)</Label>
                <Input 
                  id="height"
                  type="number"
                  placeholder="Not set"
                  value={userData?.height || ''}
                  className="border-2 border-gray-400"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input 
                  id="gender"
                  placeholder="Not set"
                  value={userData?.gender || 'Not set'}
                  className="border-2 border-gray-400"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fitness-level">Fitness Level</Label>
                <Input 
                  id="fitness-level"
                  placeholder="Not set"
                  value={userData?.fitnessLevel ? userData.fitnessLevel.charAt(0).toUpperCase() + userData.fitnessLevel.slice(1) : 'Not set'}
                  className="border-2 border-gray-400"
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input 
                id="dob"
                placeholder="Not set"
                value={userData?.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not set'}
                className="border-2 border-gray-400"
                readOnly
              />
            </div>

            <div className="text-center py-2">
              <p className="text-gray-500 text-sm">Profile information is read-only</p>
            </div>
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
                  <SelectItem value="imperial">US (lbs, in)</SelectItem>
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
