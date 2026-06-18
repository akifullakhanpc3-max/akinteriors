import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/akinteriors';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@akinteriors.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      await User.create({
        name: 'Admin',
        email: 'admin@akinteriors.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created: admin@akinteriors.com / Admin@123');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
