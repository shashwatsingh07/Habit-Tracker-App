# HabitFlow - Comprehensive Habit Tracker Web App

A modern, full-stack habit tracking application built with React, Node.js, Express, and MongoDB. HabitFlow helps users build better habits through social accountability, progress tracking, and a beautiful, intuitive interface.

## 🚀 Features

### Core Functionality
- **Interactive Landing Page**: Beautiful, responsive landing page with smooth animations
- **User Authentication**: Secure sign up, login, and logout with JWT tokens
- **Habit Management**: Create, edit, delete, and track daily/weekly habits
- **Progress Tracking**: Real-time streak counting and completion rate analytics
- **Social Features**: Follow friends, view activity feeds, and stay motivated together
- **Analytics Dashboard**: Comprehensive habit statistics and completion insights
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Key Highlights
- **Modern UI/UX**: Clean, gradient-based design with smooth animations
- **Real-time Updates**: Live progress tracking and social activity feeds
- **Data Analytics**: Comprehensive habit statistics and completion insights
- **Edge Case Handling**: Prevents duplicate habits, multiple check-ins, and self-following
- **Production Ready**: Built with TypeScript, proper error handling, and scalable architecture

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** with custom design system
- **React Hook Form** + **Zod** validation
- **React Router DOM** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests

## 🎨 Design System

- **Colors**: Purple (#8B5CF6), Cyan (#06B6D4), Green (#10B981) with comprehensive color ramps
- **Typography**: Clean, readable fonts with 150% line spacing for body text
- **Spacing**: Consistent 8px grid system throughout
- **Components**: Reusable, modular components with proper separation of concerns
- **Animations**: Thoughtful micro-interactions and hover states

## 📊 Database Schema

### Collections
- **users**: User profiles with authentication and social connections
- **habits**: User habits with categories, frequency, and progress tracking

### Security
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting and security headers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally, or MongoDB Atlas account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd habit-tracker-app
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
npm install
```

4. **Set up Environment Variables**

Frontend (.env):
```env
VITE_API_URL=http://localhost:5000/api
```

Backend (backend/.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/habitflow
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

6. **Seed the Database (Optional)**
```bash
cd backend
npm run seed
```

7. **Start the Backend Server**
```bash
cd backend
npm run dev
```

8. **Start the Frontend Development Server**
```bash
# In the root directory
npm run dev
```

9. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 📱 Usage Guide

### Getting Started
1. **Visit Landing Page**: Navigate to the homepage to learn about HabitFlow
2. **Sign Up**: Create an account with email, password, username, and full name
3. **Create Habits**: Add your first habit with custom categories and colors
4. **Track Progress**: Check off habits daily/weekly and watch your streaks grow
5. **Connect with Friends**: Search for and follow other users for accountability
6. **View Analytics**: Monitor your progress with detailed statistics and trends

### Key Features
- **Dashboard**: Overview of all habits with completion status and statistics
- **Habit Creation**: Customizable habits with categories, colors, and frequencies
- **Social Feed**: Real-time activity from friends you follow
- **Analytics**: Detailed progress tracking and completion insights
- **Profile**: Personal progress overview and account management
- **Mobile Optimized**: Full functionality on all device sizes

## 🏗 Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── habits/         # Habit-related components
│   └── layout/         # Layout and navigation
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
├── services/           # API service functions
└── styles/             # CSS and styling
```

### Backend Structure
```
backend/
├── models/             # Mongoose models
├── routes/             # Express route handlers
├── middleware/         # Custom middleware
├── scripts/            # Utility scripts (seeding)
└── server.js           # Main server file
```

## 🔒 Security Features

- **Authentication**: Secure JWT token-based authentication
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for security headers
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 📈 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Habits
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/toggle` - Toggle habit completion

### Social
- `GET /api/social/search` - Search users
- `POST /api/social/follow/:userId` - Follow user
- `DELETE /api/social/follow/:userId` - Unfollow user
- `GET /api/social/following` - Get following list
- `GET /api/social/followers` - Get followers list
- `GET /api/social/activity` - Get friends' activity

### Analytics
- `GET /api/analytics/overview` - Get overall statistics
- `GET /api/analytics/trends` - Get habit trends
- `GET /api/analytics/weekly` - Get weekly data
- `GET /api/analytics/categories` - Get category analytics

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting platform

### Backend Deployment (Railway/Render/Heroku)
1. Deploy the `backend` folder to your hosting platform
2. Set environment variables (MongoDB URI, JWT Secret, etc.)
3. Ensure MongoDB database is accessible

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use a strong JWT secret
- Configure MongoDB Atlas or hosted MongoDB
- Set proper CORS origins

## 🤝 Contributing

This project demonstrates full-stack development capabilities including:
- Modern React development with TypeScript
- RESTful API design and implementation
- Database design and management
- Authentication and authorization
- Social features implementation
- Responsive UI/UX design
- Production deployment readiness

## 📄 License

This project is built as a demonstration of full-stack development capabilities and modern web application architecture.

---

**HabitFlow** - Build better habits, together. 🌟

## Sample Login Credentials (if using seed data)
- Email: john@example.com, Password: password123
- Email: jane@example.com, Password: password123
- Email: mike@example.com, Password: password123