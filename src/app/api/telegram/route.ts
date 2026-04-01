import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, service, date, timeSlot } = await request.json();

    await sendTelegramNotification(
      [
        '🔔 <b>NEW APPOINTMENT — JASSU CAFE</b>',
        '',
        `👤 <b>Name:</b> ${name}`,
        `📞 <b>Phone:</b> ${phone}`,
        `📧 <b>Email:</b> ${email || 'N/A'}`,
        `📋 <b>Service:</b> ${service}`,
        `📅 <b>Date:</b> ${date}`,
        `🕐 <b>Time:</b> ${timeSlot}`,
        '',
        '---',
        `<i>Booked at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</i>`,
      ].join('\n'),
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
