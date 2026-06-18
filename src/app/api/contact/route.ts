import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Inquiry from '@/models/Inquiry';
import { sendInquiryNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();

    const inquiry = await Inquiry.create(body);

    await sendInquiryNotification(body).catch(() => {});

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
