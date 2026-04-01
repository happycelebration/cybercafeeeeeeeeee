import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalAppointments,
      todayAppointments,
      totalJobs,
      activeJobs,
      recentAppointments,
      appointmentsByService,
    ] = await Promise.all([
      storage.countAppointments(),
      storage.countAppointments({ date: today }),
      storage.countJobs(),
      storage.countJobs({ status: 'active' }),
      storage.getRecentAppointments(10),
      storage.getAppointmentsByService(),
    ]);

    return NextResponse.json({
      totalAppointments,
      todayAppointments,
      totalJobs,
      activeJobs,
      recentAppointments,
      appointmentsByService: appointmentsByService.map((s) => ({
        service: s.service,
        _count: { service: s.count },
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
