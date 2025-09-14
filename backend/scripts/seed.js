const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Habit = require('../models/Habit');

// Sample data
const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    fullName: 'Jane Smith'
  },
  {
    username: 'mike_wilson',
    email: 'mike@example.com',
    password: 'password123',
    fullName: 'Mike Wilson'
  }
];

const sampleHabits = [
  {
    name: 'Morning Exercise',
    description: '30 minutes of cardio or strength training',
    category: 'Health & Fitness',
    frequency: 'daily',
    color: '#10B981'
  },
  {
    name: 'Read for 30 minutes',
    description: 'Read books, articles, or educational content',
    category: 'Learning',
    frequency: 'daily',
    color: '#8B5CF6'
  },
  {
    name: 'Meditation',
    description: '10 minutes of mindfulness meditation',
    category: 'Mindfulness',
    frequency: 'daily',
    color: '#06B6D4'
  },
  {
    name: 'Weekly Planning',
    description: 'Plan and organize the upcoming week',
    category: 'Productivity',
    frequency: 'weekly',
    color: '#F59E0B'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habitflow');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Habit.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create habits for each user
    for (const user of createdUsers) {
      for (const habitData of sampleHabits) {
        const habit = new Habit({
          ...habitData,
          user: user._id
        });

        // Add some sample completions (last 7 days with 70% completion rate)
        const completions = [];
        for (let i = 0; i < 7; i++) {
          if (Math.random() > 0.3) { // 70% chance of completion
            const date = new Date();
            date.setDate(date.getDate() - i);
            completions.push({ date });
          }
        }
        habit.completions = completions;

        await habit.save();
        console.log(`Created habit: ${habit.name} for ${user.username}`);
      }
    }

    // Create some follow relationships
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      $addToSet: { following: createdUsers[1]._id }
    });
    await User.findByIdAndUpdate(createdUsers[1]._id, {
      $addToSet: { followers: createdUsers[0]._id }
    });

    await User.findByIdAndUpdate(createdUsers[0]._id, {
      $addToSet: { following: createdUsers[2]._id }
    });
    await User.findByIdAndUpdate(createdUsers[2]._id, {
      $addToSet: { followers: createdUsers[0]._id }
    });

    console.log('Created follow relationships');
    console.log('\nSeed data created successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: jane@example.com, Password: password123');
    console.log('Email: mike@example.com, Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seed function
seedDatabase();