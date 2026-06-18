'use server';

import { connectDB } from '@/lib/db/connect';
import User from '@/models/User';

export async function checkAdminExists() {
  try {
    await connectDB();
    const count = await User.countDocuments({ role: 'admin' });
    return { exists: count > 0 };
  } catch {
    return { exists: false, error: 'Database connection failed' };
  }
}

export async function createSuperAdmin(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    await connectDB();

    const existingAdmin = await User.countDocuments({ role: 'admin' });
    if (existingAdmin > 0) {
      return { success: false, error: 'A Super Admin already exists. Setup is disabled.' };
    }

    const existingUser = await User.findOne({ email: data.email.toLowerCase().trim() });
    if (existingUser) {
      return { success: false, error: 'A user with this email already exists.' };
    }

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role: 'admin',
      isActive: true,
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create admin account',
    };
  }
}
