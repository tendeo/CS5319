import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Activity, ArrowLeft, ArrowRight } from "lucide-react";

interface RegistrationFitnessInfoProps {
  onBack: () => void;
  onNext: (data: any) => void;
  basicInfo: any;
}

export function RegistrationFitnessInfo({ onBack, onNext, basicInfo }: RegistrationFitnessInfoProps) {
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    fitnessLevel: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setError('');

    // Basic validation
    if (!formData.dateOfBirth || !formData.gender || !formData.height || !formData.weight || !formData.fitnessLevel) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.height) <= 0 || parseFloat(formData.weight) <= 0) {
      setError('Height and weight must be positive numbers');
      return;
    }

    onNext({ ...basicInfo, ...formData });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 border-2 border-gray-800 rounded-lg flex items-center justify-center">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-gray-900">Fitness Information</h1>
          <p className="text-gray-600">Step 2 of 3: Tell us about your fitness</p>
        </div>

        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full border-2 border-gray-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Basic Info
        </Button>

        {/* Fitness Information Form */}
        <div className="border-2 border-gray-800 p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Fitness Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input 
                id="dateOfBirth" 
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="border-2 border-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <select 
                id="gender" 
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input 
                  id="height" 
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="175"
                  className="border-2 border-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input 
                  id="weight" 
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="70"
                  className="border-2 border-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fitnessLevel">Fitness Level *</Label>
              <select 
                id="fitnessLevel" 
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              >
                <option value="">Select Fitness Level</option>
                <option value="beginner">Beginner - Just starting out</option>
                <option value="intermediate">Intermediate - Some experience</option>
                <option value="advanced">Advanced - Very experienced</option>
                <option value="expert">Expert - Professional level</option>
              </select>
            </div>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={onBack}
              className="flex-1 border-2 border-gray-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleNext}
              className="flex-1 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-100"
            >
              Next: Fitness Goals
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}