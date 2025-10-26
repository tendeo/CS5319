import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationBasicInfo } from './components/RegistrationBasicInfo';
import { RegistrationFitnessInfo } from './components/RegistrationFitnessInfo';
import { RegistrationFitnessGoals } from './components/RegistrationFitnessGoals';
import { DashboardScreen } from './components/DashboardScreen';
import { WorkoutLogScreen } from './components/WorkoutLogScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { GoalSettingScreen } from './components/GoalSettingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { testApiConnection } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [apiConnected, setApiConnected] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'none' | 'basic' | 'fitness' | 'goals'>('none');
  const [registrationData, setRegistrationData] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Test API connection on app start
    testApiConnection().then(setApiConnected);
  }, []);

  const handleLogin = () => {
    // For demo purposes, set a default user if no current user
    if (!currentUser) {
      setCurrentUser({
        firstName: 'Demo',
        lastName: 'User',
        weight: 70,
        height: 175,
        fitnessLevel: 'intermediate',
        gender: 'Male',
        goals: [
          { category: 'strength', goal: 'Bench Press', metric: '225 lbs x 10 reps' },
          { category: 'cardio', goal: 'Run', metric: '5 miles in 30 minutes' }
        ]
      });
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveScreen('dashboard');
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  const handleShowRegistration = () => {
    setRegistrationStep('basic');
  };

  const handleBackToLogin = () => {
    setRegistrationStep('none');
    setRegistrationData({});
  };

  const handleRegistrationNext = (data: any) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    if (registrationStep === 'basic') {
      setRegistrationStep('fitness');
    } else if (registrationStep === 'fitness') {
      setRegistrationStep('goals');
    }
  };

  const handleRegistrationBack = () => {
    if (registrationStep === 'fitness') {
      setRegistrationStep('basic');
    } else if (registrationStep === 'goals') {
      setRegistrationStep('fitness');
    }
  };

  const handleRegistrationComplete = (userData: any) => {
    setCurrentUser(userData);
    setRegistrationStep('none');
    setRegistrationData({});
    handleLogin(); // Auto-login after successful registration
  };

  if (!isLoggedIn) {
    if (registrationStep === 'basic') {
      return <RegistrationBasicInfo onBack={handleBackToLogin} onNext={handleRegistrationNext} />;
    }
    if (registrationStep === 'fitness') {
      return <RegistrationFitnessInfo onBack={handleRegistrationBack} onNext={handleRegistrationNext} basicInfo={registrationData} />;
    }
    if (registrationStep === 'goals') {
      return <RegistrationFitnessGoals onBack={handleRegistrationBack} onComplete={handleRegistrationComplete} previousData={registrationData} />;
    }
    return <LoginScreen onLogin={handleLogin} onShowRegistration={handleShowRegistration} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* API Connection Status */}
      <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-sm font-medium z-50 ${
        apiConnected 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {apiConnected ? '🟢 Backend Connected' : '🔴 Backend Disconnected'}
      </div>

      {activeScreen === 'dashboard' && <DashboardScreen onNavigate={handleNavigate} userData={currentUser} />}
      {activeScreen === 'workout' && <WorkoutLogScreen onNavigate={handleNavigate} />}
      {activeScreen === 'progress' && <ProgressScreen onNavigate={handleNavigate} />}
      {activeScreen === 'goals' && <GoalSettingScreen onNavigate={handleNavigate} />}
      {activeScreen === 'profile' && <ProfileScreen onNavigate={handleNavigate} onLogout={handleLogout} />}
      
      <BottomNavigation activeScreen={activeScreen} onNavigate={handleNavigate} />
    </div>
  );
}
