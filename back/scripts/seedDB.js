const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Note = require('../models/Note');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Clear existing data (optional - uncomment if you want to reset)
    // await User.deleteMany({});
    // await Note.deleteMany({});
 
    const db = mongoose.connection.db;
    
    try {
      await db.createCollection('users');
      console.log('Users collection created');
    } catch (error) {
      if (error.codeName === 'NamespaceExists') {
        console.log('Users collection already exists');
      } else {
        throw error;
      }
    }

    try {
      await db.createCollection('notes');
      console.log('Notes collection created');
    } catch (error) {
      if (error.codeName === 'NamespaceExists') {
        console.log('Notes collection already exists');
      } else {
        throw error;
      }
    }

    await User.createIndexes();
    await Note.createIndexes();
    console.log('Database indexes created');

    const collections = await db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    console.log('\n Database setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the server with: npm run dev');
    console.log('2. Register users via POST /api/auth/register');
    console.log('3. Create encrypted notes via POST /api/notes');

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();