const express = require('express');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get overall analytics for the user
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ 
      user: req.user._id, 
      isActive: true 
    });

    if (habits.length === 0) {
      return res.json({
        stats: {
          totalHabits: 0,
          completedToday: 0,
          currentStreak: 0,
          longestStreak: 0,
          completionRate: 0,
          totalCompletions: 0
        }
      });
    }

    // Calculate overall stats
    const totalHabits = habits.length;
    const completedToday = habits.filter(habit => habit.completedToday).length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completions.length, 0);
    
    // Calculate average completion rate
    const avgCompletionRate = habits.reduce((sum, habit) => sum + habit.completionRate, 0) / habits.length;
    
    // Calculate current streak (average of all habits)
    const avgCurrentStreak = habits.reduce((sum, habit) => sum + habit.currentStreak, 0) / habits.length;
    
    // Calculate longest streak across all habits
    const longestStreak = Math.max(...habits.map(habit => calculateLongestStreak(habit.completions)));

    const stats = {
      totalHabits,
      completedToday,
      currentStreak: Math.round(avgCurrentStreak),
      longestStreak,
      completionRate: Math.round(avgCompletionRate),
      totalCompletions
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// @route   GET /api/analytics/trends
// @desc    Get habit trends and performance data
// @access  Private
router.get('/trends', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ 
      user: req.user._id, 
      isActive: true 
    }).sort({ createdAt: -1 });

    const trends = habits.map(habit => ({
      name: habit.name,
      color: habit.color,
      completions: habit.completions.length,
      streak: habit.currentStreak,
      completionRate: habit.completionRate,
      category: habit.category,
      frequency: habit.frequency,
      createdAt: habit.createdAt
    }));

    res.json({ trends });
  } catch (error) {
    console.error('Get analytics trends error:', error);
    res.status(500).json({ message: 'Server error fetching trends' });
  }
});

// @route   GET /api/analytics/weekly
// @desc    Get weekly completion data
// @access  Private
router.get('/weekly', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ 
      user: req.user._id, 
      isActive: true 
    });

    // Get last 7 days
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayCompletions = habits.reduce((count, habit) => {
        const hasCompletion = habit.completions.some(completion => {
          const completionDate = new Date(completion.date);
          completionDate.setHours(0, 0, 0, 0);
          return completionDate.getTime() === date.getTime();
        });
        return count + (hasCompletion ? 1 : 0);
      }, 0);

      weekData.push({
        date: date.toISOString().split('T')[0],
        completions: dayCompletions,
        totalHabits: habits.length,
        completionRate: habits.length > 0 ? (dayCompletions / habits.length) * 100 : 0
      });
    }

    res.json({ weekData });
  } catch (error) {
    console.error('Get weekly analytics error:', error);
    res.status(500).json({ message: 'Server error fetching weekly data' });
  }
});

// @route   GET /api/analytics/categories
// @desc    Get completion data by category
// @access  Private
router.get('/categories', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ 
      user: req.user._id, 
      isActive: true 
    });

    // Group by category
    const categoryData = {};
    
    habits.forEach(habit => {
      if (!categoryData[habit.category]) {
        categoryData[habit.category] = {
          category: habit.category,
          totalHabits: 0,
          totalCompletions: 0,
          avgCompletionRate: 0,
          habits: []
        };
      }

      categoryData[habit.category].totalHabits++;
      categoryData[habit.category].totalCompletions += habit.completions.length;
      categoryData[habit.category].habits.push({
        name: habit.name,
        completions: habit.completions.length,
        completionRate: habit.completionRate,
        streak: habit.currentStreak
      });
    });

    // Calculate average completion rates
    Object.keys(categoryData).forEach(category => {
      const data = categoryData[category];
      data.avgCompletionRate = data.habits.reduce((sum, habit) => sum + habit.completionRate, 0) / data.habits.length;
    });

    const categories = Object.values(categoryData);

    res.json({ categories });
  } catch (error) {
    console.error('Get category analytics error:', error);
    res.status(500).json({ message: 'Server error fetching category data' });
  }
});

// Helper function to calculate longest streak
function calculateLongestStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  
  const sortedDates = completions
    .map(c => new Date(c.date))
    .sort((a, b) => a - b);
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = sortedDates[i - 1];
    const currentDate = sortedDates[i];
    const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
    
    if (dayDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
}

module.exports = router;