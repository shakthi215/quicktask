from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGO_URI'))
db = client['quicktask']
tasks_collection = db['tasks']
users_collection = db['users']

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'QuickTask Analytics Service is running'})

@app.route('/api/analytics/user-stats/<user_id>', methods=['GET'])
def get_user_stats(user_id):
    """Get aggregate statistics for a specific user"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            return jsonify({'error': 'Invalid user ID'}), 400
        
        user_object_id = ObjectId(user_id)
        
        # Get all tasks for user
        tasks = list(tasks_collection.find({'user': user_object_id}))
        
        if not tasks:
            return jsonify({
                'userId': user_id,
                'totalTasks': 0,
                'completedTasks': 0,
                'pendingTasks': 0,
                'completionRate': 0,
                'averageTasksPerDay': 0,
                'priorityBreakdown': {'Low': 0, 'Medium': 0, 'High': 0},
                'statusBreakdown': {'Todo': 0, 'In Progress': 0, 'Completed': 0}
            })
        
        total_tasks = len(tasks)
        completed_tasks = sum(1 for task in tasks if task.get('status') == 'Completed')
        pending_tasks = total_tasks - completed_tasks
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Calculate average tasks per day
        if tasks:
            oldest_task_date = min(task.get('createdAt', datetime.now()) for task in tasks)
            days_active = max((datetime.now() - oldest_task_date).days, 1)
            avg_tasks_per_day = total_tasks / days_active
        else:
            avg_tasks_per_day = 0
        
        # Priority breakdown
        priority_breakdown = {
            'Low': sum(1 for task in tasks if task.get('priority') == 'Low'),
            'Medium': sum(1 for task in tasks if task.get('priority') == 'Medium'),
            'High': sum(1 for task in tasks if task.get('priority') == 'High')
        }
        
        # Status breakdown
        status_breakdown = {
            'Todo': sum(1 for task in tasks if task.get('status') == 'Todo'),
            'In Progress': sum(1 for task in tasks if task.get('status') == 'In Progress'),
            'Completed': sum(1 for task in tasks if task.get('status') == 'Completed')
        }
        
        return jsonify({
            'userId': user_id,
            'totalTasks': total_tasks,
            'completedTasks': completed_tasks,
            'pendingTasks': pending_tasks,
            'completionRate': round(completion_rate, 2),
            'averageTasksPerDay': round(avg_tasks_per_day, 2),
            'priorityBreakdown': priority_breakdown,
            'statusBreakdown': status_breakdown
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/productivity/<user_id>', methods=['GET'])
def get_productivity_analysis(user_id):
    """Get task completion trends over a specified time period"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            return jsonify({'error': 'Invalid user ID'}), 400
        
        user_object_id = ObjectId(user_id)
        
        # Get time period from query params (default to 30 days)
        days = int(request.args.get('days', 30))
        start_date = datetime.now() - timedelta(days=days)
        
        # Get tasks within the time period
        tasks = list(tasks_collection.find({
            'user': user_object_id,
            'createdAt': {'$gte': start_date}
        }))
        
        # Group tasks by day
        daily_stats = {}
        for task in tasks:
            created_date = task.get('createdAt', datetime.now())
            day_key = created_date.strftime('%Y-%m-%d')
            
            if day_key not in daily_stats:
                daily_stats[day_key] = {
                    'date': day_key,
                    'created': 0,
                    'completed': 0
                }
            
            daily_stats[day_key]['created'] += 1
            if task.get('status') == 'Completed':
                daily_stats[day_key]['completed'] += 1
        
        # Convert to list and sort by date
        daily_trends = sorted(daily_stats.values(), key=lambda x: x['date'])
        
        # Calculate weekly statistics
        total_created = sum(day['created'] for day in daily_trends)
        total_completed = sum(day['completed'] for day in daily_trends)
        
        productivity_score = (total_completed / total_created * 100) if total_created > 0 else 0
        
        # Get most productive day
        most_productive_day = max(daily_trends, key=lambda x: x['completed']) if daily_trends else None
        
        return jsonify({
            'userId': user_id,
            'period': f'{days} days',
            'dailyTrends': daily_trends,
            'summary': {
                'totalCreated': total_created,
                'totalCompleted': total_completed,
                'productivityScore': round(productivity_score, 2),
                'mostProductiveDay': most_productive_day
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port)   