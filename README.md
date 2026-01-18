# 🚀 QuickTask – Full Stack Task Management App

QuickTask is a **full-stack MERN application** with an additional **Python analytics microservice**. It allows users to register, log in, manage tasks, and view productivity analytics.

---

## 🧱 Project Structure

```
quicktask/
│
├── frontend/           # React (Create React App)
├── backend/            # Node.js + Express + MongoDB API
├── python-analytics/   # Flask-based analytics service
└── README.md
```

---

## 🌐 Live Deployment URLs

* **Frontend (Vercel)**
  👉 [https://quicktask-liard.vercel.app](https://quicktask-liard.vercel.app)

* **Backend API (Render)**
  👉 [https://quicktask-backend-qqcs.onrender.com](https://quicktask-backend-qqcs.onrender.com)

* **Analytics API (Render)**
  👉 [https://quicktask-analytics.onrender.com](https://quicktask-analytics.onrender.com)

---

## ✨ Features

### ✅ Authentication

* User registration & login
* JWT-based authentication

### ✅ Task Management

* Create, update, delete tasks
* Priority & status tracking
* Due dates

### ✅ Analytics (Python Service)

* User task statistics
* Productivity trends
* Completion rate

---

## ⚙️ Tech Stack

### Frontend

* React (CRA)
* Axios
* React Context API
* Tailwind CSS

### Backend

* Node.js
* Express
* MongoDB + Mongoose
* JWT Authentication
* bcrypt

### Analytics

* Python
* Flask
* Flask-CORS
* PyMongo
* Gunicorn (production)

---

# 📁 FRONTEND

## 📂 `frontend/`

### Setup (Local)

```bash
cd frontend
npm install
npm start
```

### Production Environment Variables (Vercel)

```
REACT_APP_API_URL=https://quicktask-backend-qqcs.onrender.com/api
REACT_APP_ANALYTICS_URL=https://quicktask-analytics.onrender.com/api/analytics
```

### Build

```bash
npm run build
```

---

# 📁 BACKEND

## 📂 `backend/`

### Setup (Local)

```bash
cd backend
npm install
npm run dev
```

### Environment Variables (Render / Local `.env`)

```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
FRONTEND_URL=https://quicktask-liard.vercel.app
```

### API Base URL

```
/api/auth
/api/tasks
```

### Health Check

```
GET /
```

Returns:

```json
{ "message": "QuickTask API is running" }
```

---

# 📁 PYTHON ANALYTICS

## 📂 `python-analytics/`

### Setup (Local)

```bash
cd python-analytics
pip install -r requirements.txt
python app.py
```

### Production Start (Render)

```bash
gunicorn app:app
```

### Environment Variables

```
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
```

### Analytics Endpoints

* **User Stats**

```
GET /api/analytics/user-stats/:userId
```

* **Productivity Trends**

```
GET /api/analytics/productivity/:userId?days=30
```

---

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in `localStorage`
4. Axios interceptor attaches token to requests

---

## 🚀 Deployment Summary

| Service   | Platform | Notes              |
| --------- | -------- | ------------------ |
| Frontend  | Vercel   | React build        |
| Backend   | Render   | Node Web Service   |
| Analytics | Render   | Python Web Service |

---

## 🧪 Testing

* Backend tested via Postman
* Frontend tested via browser + DevTools
* Analytics endpoints tested via browser/Postman

---

## 👨‍💻 Author

**Shakthi**
GitHub: [https://github.com/shakthi215](https://github.com/shakthi215)

---

✅ **QuickTask is fully deployed and production-ready.**