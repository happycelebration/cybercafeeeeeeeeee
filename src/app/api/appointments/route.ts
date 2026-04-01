import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { sendTelegramNotification } from '@/lib/telegram';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const appointments = await storage.getAppointments(date || undefined);
    return NextResponse.json(appointments);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, service, date, timeSlot } = await request.json();

    if (!name || !phone || !service || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await storage.getAppointmentBySlot(date, timeSlot);
    if (existing) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please select another slot.' },
        { status: 409 },
      );
    }

    const appointment = await storage.createAppointment({
      name,
      phone,
      email: email || null,
      service,
      date,
      timeSlot,
    });

    sendTelegramNotification(
      [
        '🔔 <b>NEW APPOINTMENT BOOKING</b>',
        '━━━━━━━━━━━━━━━━━━━',
        '',
        `<b>👤 Name:</b> ${name}`,
        `<b>📞 Phone:</b> ${phone}`,
        `<b>📧 Email:</b> ${email || 'Not provided'}`,
        '',
        `<b>📋 Service:</b> ${service}`,
        `<b>📅 Date:</b> ${date}`,
        `<b>🕐 Time Slot:</b> ${timeSlot}`,
        '',
        `<b>🆔 Booking ID:</b> <code>${appointment.id.slice(0, 8)}</code>`,
        `<b>✅ Status:</b> Confirmed`,
        '',
        `⏰ <i>Booked at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</i>`,
      ].join('\n'),
    ).catch(() => {});

    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
    }
    await storage.deleteAppointment(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
