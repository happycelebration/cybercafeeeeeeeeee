import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    const slots = await storage.getSlots();
    return NextResponse.json(slots);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, enabled } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing slot id' }, { status: 400 });
    }
    const slot = await storage.updateSlot(id, enabled);
    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }
    return NextResponse.json(slot);
  } catch {
    return NextResponse.json({ error: 'Failed to update slot' }, { status: 500 });
  }
}
