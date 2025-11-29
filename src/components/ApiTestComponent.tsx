import { useState } from 'react';
import { userApi, workoutApi, goalApi } from '../services/api';

export function ApiTestComponent() {
  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready to test');

  const testUserApi = async () => {
    console.log('Test button clicked');
    setLoading(true);
    setStatus('Testing Users API...');
    
    try {
      console.log('Making API call to:', 'http://localhost:8081/api/users');
      const response = await fetch('http://localhost:8081/api/users');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const userData = await response.json();
      console.log('Response data:', userData);
      
      setUsers(userData);
      setStatus('Users API working! Found ${userData.length} users`);
    } catch (error) {
      console.error('Error fetching users:', error);
      setStatus(`Users API failed: ${error.message}`);
    }
    setLoading(false);
  };

  const testWorkoutApi = async () => {
    setLoading(true);
    try {
      const workoutData = await workoutApi.getAll();
      setWorkouts(workoutData);
      console.log('Workouts:', workoutData);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
    setLoading(false);
  };

  const testGoalApi = async () => {
    setLoading(true);
    try {
      const goalData = await goalApi.getAll();
      setGoals(goalData);
      console.log('Goals:', goalData);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
    setLoading(false);
  };

  const createTestUser = async () => {
    setLoading(true);
    setStatus('Creating test user...');
    try {
      console.log('Creating hardcoded test user');
      const response = await fetch('http://localhost:8081/api/test/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const createdUser = await response.json();
      console.log('Created user:', createdUser);
      setStatus(`Test user created! ID: ${createdUser.id}`);
      
      // Refresh the user list
      testUserApi();
    } catch (error) {
      console.error('Error creating user:', error);
      setStatus(`Failed to create user: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">API Test Component</h2>
      
      <div className="space-y-4">
        {/* Simple Test Button */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Quick Test</h3>
          <div className="space-y-2">
            <button 
              onClick={async () => {
                console.log('Testing backend connection');
                setStatus('Testing connection');
                try {
                  const response = await fetch('http://localhost:8081/api/test/test-connection');
                  const result = await response.text();
                  setStatus(`${result}`);
                  console.log('Backend response:', result);
                } catch (error) {
                  setStatus(`Connection failed: ${error.message}`);
                  console.error('Connection error:', error);
                }
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
            >
              Test Connection
            </button>
            <button 
              onClick={testUserApi}
              disabled={loading}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 font-medium"
            >
              Test Users API
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={testUserApi}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Users API
          </button>
          
          <button 
            onClick={testWorkoutApi}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Workouts API
          </button>
          
          <button 
            onClick={testGoalApi}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Test Goals API
          </button>
          
          <button 
            onClick={createTestUser}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Create Test User
          </button>
        </div>

        {loading && <p className="text-blue-600">Loading...</p>}
        
        <div className="bg-blue-50 p-3 rounded border">
          <p className="text-sm font-medium">Status: {status}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Users ({users.length})</h3>
            <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-gray-500">No users found</p>
              ) : (
                users.map((user: any) => (
                  <div key={user.id} className="text-sm">
                    <p><strong>{user.username}</strong></p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Workouts ({workouts.length})</h3>
            <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
              {workouts.length === 0 ? (
                <p className="text-gray-500">No workouts found</p>
              ) : (
                workouts.map((workout: any) => (
                  <div key={workout.id} className="text-sm">
                    <p><strong>{workout.name}</strong></p>
                    <p className="text-gray-600">{workout.type}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Goals ({goals.length})</h3>
            <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
              {goals.length === 0 ? (
                <p className="text-gray-500">No goals found</p>
              ) : (
                goals.map((goal: any) => (
                  <div key={goal.id} className="text-sm">
                    <p><strong>{goal.title}</strong></p>
                    <p className="text-gray-600">{goal.status}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
