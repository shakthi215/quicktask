import React from 'react';
import { taskAPI } from '../services/api';

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const priorityColors = {
    Low: 'bg-blue-100 text-blue-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    'Todo': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-green-100 text-green-800'
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await taskAPI.updateTask(task._id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[task.status]}`}>
              {task.status}
            </span>
          </div>
          
          {task.description && (
            <p className="text-gray-600 mb-2">{task.description}</p>
          )}
          
          <div className="text-sm text-gray-500">
            <span>Due: {formatDate(task.dueDate)}</span>
            {isOverdue && <span className="ml-2 text-red-600 font-semibold">Overdue!</span>}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
          >
            Edit
          </button>
          
          <button
            onClick={() => onDelete(task._id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;