'use server';

import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  await connectDB();

  const user = await User.findById(session.user.id).select('name email role');
  if (!user) return { success: false, error: 'User not found' };

  return { success: true, user: JSON.parse(JSON.stringify(user)) };
}

export async function updateProfile(data: { name?: string; email?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  await connectDB();

  try {
    if (data.email) {
      const existing = await User.findOne({ email: data.email.toLowerCase(), _id: { $ne: session.user.id } });
      if (existing) return { success: false, error: 'Email already in use' };
    }

    const updateData: Record<string, string> = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase();

    await User.findByIdAndUpdate(session.user.id, { $set: updateData });

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function updatePassword(data: { currentPassword: string; newPassword: string }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  if (data.newPassword.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

  await connectDB();

  try {
    const user = await User.findById(session.user.id).select('+password');
    if (!user) return { success: false, error: 'User not found' };

    const isMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isMatch) return { success: false, error: 'Current password is incorrect' };

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(data.newPassword, salt);
    await user.save();

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update password' };
  }
}
