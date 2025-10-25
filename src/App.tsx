import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { WorkoutLogScreen } from './components/WorkoutLogScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { GoalSettingScreen } from './components/GoalSettingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavigation } from './components/BottomNavigation';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveScreen('dashboard');
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {activeScreen === 'dashboard' && <DashboardScreen onNavigate={handleNavigate} />}
      {activeScreen === 'workout' && <WorkoutLogScreen onNavigate={handleNavigate} />}
      {activeScreen === 'progress' && <ProgressScreen onNavigate={handleNavigate} />}
      {activeScreen === 'goals' && <GoalSettingScreen onNavigate={handleNavigate} />}
      {activeScreen === 'profile' && <ProfileScreen onNavigate={handleNavigate} onLogout={handleLogout} />}
      
      <BottomNavigation activeScreen={activeScreen} onNavigate={handleNavigate} />
    </div>
  );
}
