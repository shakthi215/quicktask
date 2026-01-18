import React, { useState, useEffect, useContext } from 'react';
import { taskAPI, analyticsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetchStats();
  }, [refresh]);

  const fetchStats = async () => {
    try {
      const response = await taskAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleTaskCreated = () => {
    setShowForm(false);
    setEditingTask(null);
    setRefresh(prev => prev + 1);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  const priorityData = stats ? [
    { name: 'Low', value: stats.priorityDistribution.Low },
    { name: 'Medium', value: stats.priorityDistribution.Medium },
    { name: 'High', value: stats.priorityDistribution.High }
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTask(null);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <TaskForm 
            task={editingTask} 
            onSuccess={handleTaskCreated}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTasks}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingTasks}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
          </div>
        </div>
      )}

      {stats && stats.totalTasks > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Task Distribution by Priority</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <TaskList onEdit={handleEdit} refresh={refresh} onUpdate={() => setRefresh(prev => prev + 1)} />
    </div>
  );
};

export default Dashboard;