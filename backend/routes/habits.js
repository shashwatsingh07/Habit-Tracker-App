const express = require('express');
const { body, validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/habits
// @desc    Get all habits for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ 
      user: req.user._id, 
      isActive: true 
    }).sort({ createdAt: -1 });

    // Transform habits to include computed fields
    const transformedHabits = habits.map(habit => ({
      _id: habit._id,
      name: habit.name,
      description: habit.description,
      category: habit.category,
      frequency: habit.frequency,
      color: habit.color,
      createdAt: habit.createdAt,
      streak: habit.currentStreak,
      completedToday: habit.completedToday,
      completionRate: habit.completionRate
    }));

    res.json({ habits: transformedHabits });
  } catch (error) {
    console.error('Fetch habits error:', error);
    res.status(500).json({ message: 'Server error fetching habits' });
  }
});

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Habit name is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('category').isIn([
    'Health & Fitness', 'Learning', 'Productivity', 'Mindfulness', 
    'Relationships', 'Hobbies', 'Finance', 'Other'
  ]).withMessage('Invalid category'),
  body('frequency').isIn(['daily', 'weekly']).withMessage('Frequency must be daily or weekly'),
  body('color').matches(/^#[0-9A-F]{6}$/i).withMessage('Invalid color format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, description, category, frequency, color } = req.body;

    // Check if habit with same name already exists for this user
    const existingHabit = await Habit.findOne({ 
      user: req.user._id, 
      name: name.trim(),
      isActive: true 
    });

    if (existingHabit) {
      return res.status(400).json({ 
        message: 'A habit with this name already exists' 
      });
    }

    const habit = new Habit({
      name: name.trim(),
      description: description?.trim() || '',
      category,
      frequency,
      color,
      user: req.user._id
    });

    await habit.save();

    res.status(201).json({
      message: 'Habit created successfully',
      habit: {
        _id: habit._id,
        name: habit.name,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        color: habit.color,
        createdAt: habit.createdAt,
        streak: 0,
        completedToday: false,
        completionRate: 0
      }
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ message: 'Server error creating habit' });
  }
});

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', [
  auth,
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isLength({ max: 500 }),
  body('category').optional().isIn([
    'Health & Fitness', 'Learning', 'Productivity', 'Mindfulness', 
    'Relationships', 'Hobbies', 'Finance', 'Other'
  ]),
  body('frequency').optional().isIn(['daily', 'weekly']),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const habit = await Habit.findOne({ 
      _id: req.params.id, 
      user: req.user._id,
      isActive: true 
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        habit[key] = updates[key];
      }
    });

    await habit.save();

    res.json({
      message: 'Habit updated successfully',
      habit: {
        _id: habit._id,
        name: habit.name,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        color: habit.color,
        createdAt: habit.createdAt,
        streak: habit.currentStreak,
        completedToday: habit.completedToday,
        completionRate: habit.completionRate
      }
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ message: 'Server error updating habit' });
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      _id: req.params.id, 
      user: req.user._id,
      isActive: true 
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    habit.isActive = false;
    await habit.save();

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ message: 'Server error deleting habit' });
  }
});

// @route   POST /api/habits/:id/toggle
// @desc    Toggle habit completion for today
// @access  Private
router.post('/:id/toggle', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      _id: req.params.id, 
      user: req.user._id,
      isActive: true 
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    const existingCompletion = habit.completions.find(completion => {
      const completionDate = new Date(completion.date);
      completionDate.setHours(0, 0, 0, 0);
      return completionDate.getTime() === today.getTime();
    });

    if (existingCompletion) {
      // Remove completion
      habit.completions = habit.completions.filter(completion => {
        const completionDate = new Date(completion.date);
        completionDate.setHours(0, 0, 0, 0);
        return completionDate.getTime() !== today.getTime();
      });
    } else {
      // Add completion
      habit.completions.push({ date: today });
    }

    await habit.save();

    res.json({
      message: existingCompletion ? 'Habit unmarked for today' : 'Habit completed for today',
      habit: {
        _id: habit._id,
        name: habit.name,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        color: habit.color,
        createdAt: habit.createdAt,
        streak: habit.currentStreak,
        completedToday: habit.completedToday,
        completionRate: habit.completionRate
      }
    });
  } catch (error) {
    console.error('Toggle habit error:', error);
    res.status(500).json({ message: 'Server error toggling habit' });
  }
});

// @route   GET /api/habits/:id/stats
// @desc    Get detailed stats for a specific habit
// @access  Private
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      _id: req.params.id, 
      user: req.user._id,
      isActive: true 
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const stats = {
      totalCompletions: habit.completions.length,
      currentStreak: habit.currentStreak,
      completionRate: habit.completionRate,
      longestStreak: calculateLongestStreak(habit.completions),
      recentCompletions: habit.completions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 30)
        .map(c => ({
          date: c.date,
          createdAt: c.createdAt
        }))
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get habit stats error:', error);
    res.status(500).json({ message: 'Server error fetching habit stats' });
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