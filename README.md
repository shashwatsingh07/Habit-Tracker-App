<<<<<<< HEAD
# Habit-Tracker-App
=======
# 🌱 HabitFlow - Habit Tracker App

A **full-stack MERN application** to help users build, track, and maintain healthy habits with social features and analytics.  
Built with **MongoDB, Express.js, React, Node.js**, and deployed on **Vercel** + **MongoDB Atlas**.

---
## 🚀 Screenshots

![Landing Page](https://github.com/Harshit9026/Habit-Tracker-App/blob/main/frontend/src/assets/Screenshot%202025-09-10%20173926.png)

![Login Page](https://github.com/Harshit9026/Habit-Tracker-App/blob/main/frontend/src/assets/Screenshot%202025-09-10%20174444.png)

![Dashboard Page](https://github.com/Harshit9026/Habit-Tracker-App/blob/main/frontend/src/assets/Screenshot%202025-09-10%20174531.png)



## 🚀 Features

### ✅ Core Features
- User **authentication & authorization** (JWT-based login/signup).
- Create, edit, and delete habits.
- Track daily, weekly, and monthly progress.
- Personalized dashboard with habit streaks.

### 📊 Analytics
- Visualize habit completion trends.
- Weekly and monthly reports.
- Track best-performing habits.

### 🌐 Social
- Follow friends and see their progress.
- Share achievements.
- Engage in social challenges.

### 🔒 Security
- Passwords hashed with bcrypt.
- JWT-based authentication.
- Helmet, CORS, and rate limiting for backend security.

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT) for authentication
- bcrypt for password hashing
- Helmet, CORS, Express-rate-limit


---

habitflow/
│
├── backend/ # Express backend
│ ├── routes/ # API routes (auth, habits, analytics, social)
│ ├── models/ # Mongoose models
│ ├── middleware/ # Auth middleware
│ ├── server.js # Express server (exported as handler)
│ └── .env # Environment variables
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ └── App.jsx
│ └── vite.config.js
│
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/habitflow.git
cd habitflow

2️⃣ Backend Setup
cd backend
npm install


Create a .env file in backend/:

PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173


Run backend:

npm run dev

3️⃣ Frontend Setup
cd frontend
npm install


Create a .env file in frontend/:

VITE_API_URL=http://localhost:5000/api


Run frontend:

npm run dev

## 📂 Project Structure
🚀 Deployment
Frontend (React + Vite)

Push code to GitHub.

Connect repo to Vercel.

Add environment variables in Vercel dashboard:

VITE_API_URL=https://your-backend.vercel.app/api

Deploy 🎉

Backend (Express)

Move backend to /api folder for Vercel.

Ensure server.js exports app:

module.exports = app;


Add .env variables in Vercel dashboard:

MONGODB_URI

JWT_SECRET

FRONTEND_URL=https://your-frontend.vercel.app

Deploy 🎉

📌 API Endpoints
Auth

POST /api/auth/register – Register new user

POST /api/auth/login – Login user

Habits

POST /api/habits – Create habit

GET /api/habits – Get user habits

PUT /api/habits/:id – Update habit

DELETE /api/habits/:id – Delete habit

Analytics

GET /api/analytics/summary – User habit analytics

Social

POST /api/social/follow/:id – Follow user

GET /api/social/feed – Get activity feed

🔮 Future Enhancements

Mobile app with React Native

Push notifications & reminders

Gamification (badges, points, leaderboards)

AI-based habit suggestions



>>>>>>> cae40ab (initial commit)
