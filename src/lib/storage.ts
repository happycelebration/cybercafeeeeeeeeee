import { TIME_SLOTS } from './data';
import { createClient } from '@supabase/supabase-js';

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  date: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

export interface JobNotification {
  id: string;
  title: string;
  description: string;
  lastDate: string | null;
  status: string;
  applyUrl: string | null;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export interface TimeSlotConfig {
  id: string;
  slot: string;
  enabled: boolean;
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

function mapAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    email: row.email as string | null,
    service: row.service as string,
    date: row.date as string,
    timeSlot: row.time_slot as string,
    status: row.status as string,
    createdAt: row.created_at as string,
  };
}

function mapJob(row: Record<string, unknown>): JobNotification {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    lastDate: row.last_date as string | null,
    status: row.status as string,
    applyUrl: row.apply_url as string | null,
    createdAt: row.created_at as string,
  };
}

function mapAdmin(row: Record<string, unknown>): AdminUser {
  return {
    id: row.id as string,
    email: row.email as string,
    password: row.password as string,
    name: row.name as string | null,
    role: row.role as string,
    createdAt: row.created_at as string,
  };
}

async function seedSlots() {
  const { count, error } = await supabase
    .from('slot_configs')
    .select('id', { count: 'exact', head: true });
  if (error || (count && count > 0)) return;

  const rows = TIME_SLOTS.map((slot) => ({
    id: `slot_${slot.replace(/[\s:]/g, '_')}`,
    slot,
    enabled: true,
  }));
  await supabase.from('slot_configs').insert(rows);
}

async function seedAdmin() {
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('email', 'admin@jassucafe.com')
    .limit(1);
  if (error || (data && data.length > 0)) return;

  await supabase.from('admins').insert({
    id: 'admin_001',
    email: 'admin@jassucafe.com',
    password: 'admin123',
    name: 'Jassu Admin',
    role: 'admin',
    created_at: new Date().toISOString(),
  });
}

let slotsSeeded = false;
let adminSeeded = false;

export const storage = {
  async getAppointments(date?: string): Promise<Appointment[]> {
    let query = supabase.from('appointments').select('*');
    if (date) query = query.eq('date', date);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapAppointment);
  },

  async getAppointmentBySlot(date: string, timeSlot: string): Promise<Appointment | undefined> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return undefined;
    return mapAppointment(data[0]);
  },

  async createAppointment(data: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Promise<Appointment> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const { error } = await supabase.from('appointments').insert({
      id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      service: data.service,
      date: data.date,
      time_slot: data.timeSlot,
      status: 'confirmed',
      created_at: createdAt,
    });
    if (error) throw error;
    return { id, ...data, status: 'confirmed', createdAt };
  },

  async deleteAppointment(id: string): Promise<boolean> {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async countAppointments(where?: { date?: string }): Promise<number> {
    let query = supabase.from('appointments').select('id', { count: 'exact', head: true });
    if (where?.date) query = query.eq('date', where.date);
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  async getRecentAppointments(limit: number): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).map(mapAppointment);
  },

  async getAppointmentsByService(): Promise<{ service: string; count: number }[]> {
    const { data, error } = await supabase.from('appointments').select('service');
    if (error) throw error;
    const map = new Map<string, number>();
    for (const row of data || []) {
      const svc = (row as { service: string }).service;
      map.set(svc, (map.get(svc) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count);
  },

  async getJobs(): Promise<JobNotification[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapJob);
  },

  async createJob(data: Omit<JobNotification, 'id' | 'createdAt'>): Promise<JobNotification> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const { error } = await supabase.from('jobs').insert({
      id,
      title: data.title,
      description: data.description,
      last_date: data.lastDate,
      status: data.status,
      apply_url: data.applyUrl,
      created_at: createdAt,
    });
    if (error) throw error;
    return { id, ...data, createdAt };
  },

  async updateJob(id: string, data: Partial<JobNotification>): Promise<JobNotification | null> {
    const { data: existing, error: fetchError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    if (fetchError || !existing) return null;

    const patch: Record<string, unknown> = {};
    if (data.title !== undefined) patch.title = data.title;
    if (data.description !== undefined) patch.description = data.description;
    if (data.lastDate !== undefined) patch.last_date = data.lastDate;
    if (data.status !== undefined) patch.status = data.status;
    if (data.applyUrl !== undefined) patch.apply_url = data.applyUrl;

    const { error } = await supabase.from('jobs').update(patch).eq('id', id);
    if (error) throw error;

    return {
      id: existing.id,
      title: data.title ?? existing.title,
      description: data.description ?? existing.description,
      lastDate: data.lastDate ?? (existing.last_date as string | null),
      status: data.status ?? existing.status,
      applyUrl: data.applyUrl ?? (existing.apply_url as string | null),
      createdAt: existing.created_at as string,
    };
  },

  async deleteJob(id: string): Promise<boolean> {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async countJobs(where?: { status?: string }): Promise<number> {
    let query = supabase.from('jobs').select('id', { count: 'exact', head: true });
    if (where?.status) query = query.eq('status', where.status);
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  async getSlots(): Promise<TimeSlotConfig[]> {
    if (!slotsSeeded) {
      slotsSeeded = true;
      await seedSlots();
    }
    const { data, error } = await supabase
      .from('slot_configs')
      .select('*')
      .order('slot', { ascending: true });
    if (error) throw error;
    return (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      slot: row.slot as string,
      enabled: row.enabled as boolean,
    }));
  },

  async updateSlot(id: string, enabled: boolean): Promise<TimeSlotConfig | null> {
    const { data, error } = await supabase
      .from('slot_configs')
      .update({ enabled })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) return null;
    return { id: data.id, slot: data.slot, enabled: data.enabled };
  },

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    if (!adminSeeded) {
      adminSeeded = true;
      await seedAdmin();
    }
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return undefined;
    return mapAdmin(data[0]);
  },
};
