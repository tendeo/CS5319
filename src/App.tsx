import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationBasicInfo } from './components/RegistrationBasicInfo';
import { RegistrationFitnessInfo } from './components/RegistrationFitnessInfo';
import { RegistrationFitnessGoals } from './components/RegistrationFitnessGoals';
import { DashboardScreen } from './components/DashboardScreen';
import { WorkoutLogScreen } from './components/WorkoutLogScreen';
import { GoalSettingScreen } from './components/GoalSettingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { testApiConnection, userApi } from './services/api';

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

  const handleLogin = async (email: string, password: string) => {
    try {
      // Fetch all users from backend
      const users = await userApi.getAll();
      
      // Find user by email
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Verify password (Note: In production, use proper hashing)
      if (user.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Login successful - set the authenticated user
      setCurrentUser(user);
      setIsLoggedIn(true);
      
    } catch (error: any) {
      console.error('Login error:', error);
      throw error; // Re-throw to be caught by LoginScreen
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveScreen('dashboard');
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  const refreshUserData = async () => {
    if (currentUser?.id) {
      try {
        const updatedUser = await userApi.getById(currentUser.id);
        if (updatedUser) {
          setCurrentUser(updatedUser);
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
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
    setIsLoggedIn(true); // Auto-login after successful registration
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
      {activeScreen === 'workout' && <WorkoutLogScreen onNavigate={handleNavigate} userData={currentUser} onWorkoutSaved={refreshUserData} />}
      {activeScreen === 'goals' && <GoalSettingScreen onNavigate={handleNavigate} userData={currentUser} onGoalAdded={refreshUserData} />}
      {activeScreen === 'profile' && <ProfileScreen onNavigate={handleNavigate} onLogout={handleLogout} userData={currentUser} />}
      
      <BottomNavigation activeScreen={activeScreen} onNavigate={handleNavigate} />
    </div>
  );
}
