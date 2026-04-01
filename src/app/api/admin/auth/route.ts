import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const admin = await storage.getAdminByEmail(email);
    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = Buffer.from(`${admin.id}:${admin.email}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
      token,
    });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
