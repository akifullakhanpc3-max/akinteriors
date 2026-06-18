import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { path } = await request.json();
    
    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({ success: true, revalidated: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to revalidate' }, { status: 500 });
  }
}
