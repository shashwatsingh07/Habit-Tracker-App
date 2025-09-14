const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/social/search
// @desc    Search for users by username or full name
// @access  Private
router.get('/search', [
  auth,
  query('q').isLength({ min: 1 }).withMessage('Search query is required')
], async (req, res) => {
  try {
    const searchQuery = req.query.q;
    
    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.json({ users: [] });
    }

    // Search users by username or full name (case insensitive)
    const users = await User.find({
      _id: { $ne: req.user._id }, // Exclude current user
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { fullName: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .select('username fullName avatar')
    .limit(10);

    // Check if current user is following each found user
    const usersWithFollowStatus = users.map(user => ({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
      isFollowing: req.user.following.includes(user._id)
    }));

    res.json({ users: usersWithFollowStatus });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error searching users' });
  }
});

// @route   POST /api/social/follow/:userId
// @desc    Follow a user
// @access  Private
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    // Prevent self-following
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (req.user.following.includes(targetUserId)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // Add to current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId }
    });

    // Add to target user's followers list
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId }
    });

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error following user' });
  }
});

// @route   DELETE /api/social/follow/:userId
// @desc    Unfollow a user
// @access  Private
router.delete('/follow/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    // Check if currently following
    if (!req.user.following.includes(targetUserId)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    // Remove from current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId }
    });

    // Remove from target user's followers list
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId }
    });

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Server error unfollowing user' });
  }
});

// @route   GET /api/social/following
// @desc    Get list of users the current user is following
// @access  Private
router.get('/following', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('following', 'username fullName avatar')
      .select('following');

    res.json({ following: user.following });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error fetching following list' });
  }
});

// @route   GET /api/social/followers
// @desc    Get list of users following the current user
// @access  Private
router.get('/followers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'username fullName avatar')
      .select('followers');

    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error fetching followers list' });
  }
});

// @route   GET /api/social/activity
// @desc    Get recent activity from followed users
// @access  Private
router.get('/activity', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('following');
    
    if (!user.following || user.following.length === 0) {
      return res.json({ activities: [] });
    }

    // Get recent habit completions from followed users
    const habits = await Habit.find({
      user: { $in: user.following },
      isActive: true,
      'completions.0': { $exists: true } // Only habits with completions
    })
    .populate('user', 'username fullName avatar')
    .select('name color completions user')
    .sort({ 'completions.createdAt': -1 })
    .limit(50);

    // Transform to activity feed format
    const activities = [];
    
    habits.forEach(habit => {
      // Get recent completions (last 7 days)
      const recentCompletions = habit.completions
        .filter(completion => {
          const completionDate = new Date(completion.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return completionDate >= weekAgo;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      recentCompletions.forEach(completion => {
        activities.push({
          _id: `${habit._id}_${completion._id}`,
          user: habit.user,
          habit: {
            name: habit.name,
            color: habit.color
          },
          completedAt: completion.date,
          createdAt: completion.createdAt,
          streak: calculateStreakAtDate(habit.completions, completion.date)
        });
      });
    });

    // Sort by creation date and limit
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const limitedActivities = activities.slice(0, 20);

    res.json({ activities: limitedActivities });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error fetching activity feed' });
  }
});

// Helper function to calculate streak at a specific date
function calculateStreakAtDate(completions, targetDate) {
  const sortedCompletions = completions
    .map(c => new Date(c.date))
    .filter(date => date <= new Date(targetDate))
    .sort((a, b) => b - a);

  if (sortedCompletions.length === 0) return 0;

  let streak = 0;
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i]);
    completionDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(target);
    expectedDate.setDate(target.getDate() - i);
    
    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

module.exports = router;