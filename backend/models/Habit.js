const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Health & Fitness',
      'Learning',
      'Productivity',
      'Mindfulness',
      'Relationships',
      'Hobbies',
      'Finance',
      'Other'
    ],
    default: 'Other'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    default: 'daily'
  },
  color: {
    type: String,
    required: true,
    match: /^#[0-9A-F]{6}$/i,
    default: '#8B5CF6'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completions: [{
    date: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate habits per user
habitSchema.index({ user: 1, name: 1 }, { unique: true });

// Index for efficient queries
habitSchema.index({ user: 1, isActive: 1 });
habitSchema.index({ 'completions.date': 1 });

// Virtual for current streak
habitSchema.virtual('currentStreak').get(function() {
  if (!this.completions || this.completions.length === 0) return 0;
  
  const sortedCompletions = this.completions
    .map(c => new Date(c.date))
    .sort((a, b) => b - a);
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i]);
    completionDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
});

// Virtual for completion rate
habitSchema.virtual('completionRate').get(function() {
  if (!this.completions || this.completions.length === 0) return 0;
  
  const daysSinceCreation = Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  const expectedCompletions = Math.max(1, daysSinceCreation);
  
  return Math.min(100, (this.completions.length / expectedCompletions) * 100);
});

// Virtual for today's completion status
habitSchema.virtual('completedToday').get(function() {
  if (!this.completions || this.completions.length === 0) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.completions.some(completion => {
    const completionDate = new Date(completion.date);
    completionDate.setHours(0, 0, 0, 0);
    return completionDate.getTime() === today.getTime();
  });
});

// Ensure virtuals are included in JSON
habitSchema.set('toJSON', { virtuals: true });
habitSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Habit', habitSchema);