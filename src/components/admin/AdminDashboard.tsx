'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  Briefcase,
  Clock,
  LogOut,
  X,
  Trash2,
  Plus,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Users,
  TrendingUp,
  RefreshCw,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Inbox,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdminStore } from '@/lib/admin-store';

interface AdminDashboardProps {
  onClose: () => void;
}

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

interface JobNotification {
  id: string;
  title: string;
  description: string;
  lastDate: string | null;
  status: string;
  applyUrl: string | null;
  createdAt: string;
}

interface TimeSlotConfig {
  id: string;
  slot: string;
  enabled: boolean;
}

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  totalJobs: number;
  activeJobs: number;
  recentAppointments: Appointment[];
  appointmentsByService: { service: string; _count: { service: number } }[];
}

type TabType = 'overview' | 'appointments' | 'jobs' | 'slots';

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [jobs, setJobs] = useState<JobNotification[]>([]);
  const [slots, setSlots] = useState<TimeSlotConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobNotification | null>(null);
  const [jobForm, setJobForm] = useState({ title: '', description: '', lastDate: '', status: 'active', applyUrl: '' });

  const logout = useAdminStore((s) => s.logout);
  const adminName = useAdminStore((s) => s.adminName);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) setStats(await res.json());
    } catch { }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) setAppointments(await res.json());
    } catch { }
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) setJobs(await res.json());
    } catch { }
  }, []);

  const fetchSlots = useCallback(async () => {
    try {
      const res = await fetch('/api/slots');
      if (res.ok) setSlots(await res.json());
    } catch { }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchDashboard(), fetchAppointments(), fetchJobs(), fetchSlots()]);
  }, [fetchDashboard, fetchAppointments, fetchJobs, fetchSlots]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        await Promise.all([fetchDashboard(), fetchAppointments(), fetchJobs(), fetchSlots()]);
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [fetchDashboard, fetchAppointments, fetchJobs, fetchSlots]);

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      fetchAll();
    } catch { }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job notification?')) return;
    try {
      await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' });
      fetchAll();
    } catch { }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await fetch('/api/jobs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingJob.id, ...jobForm }),
        });
      } else {
        await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobForm),
        });
      }
      setShowJobForm(false);
      setEditingJob(null);
      setJobForm({ title: '', description: '', lastDate: '', status: 'active', applyUrl: '' });
      fetchAll();
    } catch { }
  };

  const handleToggleSlot = async (id: string, enabled: boolean) => {
    try {
      await fetch('/api/slots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: !enabled }),
      });
      fetchSlots();
    } catch { }
  };

  const handleEditJob = (job: JobNotification) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      description: job.description,
      lastDate: job.lastDate || '',
      status: job.status,
      applyUrl: job.applyUrl || '',
    });
    setShowJobForm(true);
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'slots', label: 'Slots', icon: Clock },
  ];

  return (
    <div className="fixed inset-0 z-[100]" style={{ height: '100dvh' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative z-10 ml-auto flex w-full max-w-5xl flex-col overflow-hidden bg-background shadow-2xl"
        style={{ height: '100dvh' }}
      >
        <div className="relative flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-lg hover:bg-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-md shadow-teal-500/25">
              <ShieldCheck className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground sm:text-lg">Admin Dashboard</h1>
              <p className="text-[11px] text-muted-foreground">Welcome, {adminName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchAll}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => { logout(); onClose(); }}
              className="gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        <div className="relative flex shrink-0 gap-0.5 overflow-x-auto border-b border-border/50 px-4 sm:px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-neon'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="admin-tab-indicator"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-neon"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6 sm:pb-[max(2rem,env(safe-area-inset-bottom))]">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neon" />
              </div>
            ) : (
              <>

                {activeTab === 'overview' && stats && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {[
                        {
                          icon: Calendar,
                          label: 'Total Appointments',
                          value: stats.totalAppointments,
                          color: 'from-teal-500 to-emerald-500',
                          bg: 'bg-teal-500/10',
                          iconColor: 'text-teal-500',
                        },
                        {
                          icon: CalendarCheck,
                          label: "Today's Bookings",
                          value: stats.todayAppointments,
                          color: 'from-emerald-500 to-green-500',
                          bg: 'bg-emerald-500/10',
                          iconColor: 'text-emerald-500',
                        },
                        {
                          icon: Briefcase,
                          label: 'Total Job Posts',
                          value: stats.totalJobs,
                          color: 'from-amber-500 to-orange-500',
                          bg: 'bg-amber-500/10',
                          iconColor: 'text-amber-500',
                        },
                        {
                          icon: TrendingUp,
                          label: 'Active Jobs',
                          value: stats.activeJobs,
                          color: 'from-violet-500 to-purple-500',
                          bg: 'bg-violet-500/10',
                          iconColor: 'text-violet-500',
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="relative overflow-hidden rounded-xl border border-border/40 bg-card/60 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                        >
                          <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${s.color} opacity-[0.06] blur-xl`} />
                          <div className={`mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                            <s.icon className={`h-5 w-5 ${s.iconColor}`} />
                          </div>
                          <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{s.value}</p>
                          <p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {stats.appointmentsByService.length > 0 && (
                      <div className="rounded-xl border border-border/40 bg-card/60 p-5 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                          <Users className="h-4 w-4 text-neon" />
                          Appointments by Service
                        </h3>
                        <div className="space-y-3">
                          {stats.appointmentsByService.slice(0, 5).map((item) => {
                            const maxCount = stats.appointmentsByService[0]._count.service;
                            const pct = (item._count.service / maxCount) * 100;
                            return (
                              <div key={item.service}>
                                <div className="mb-1.5 flex justify-between text-xs">
                                  <span className="font-medium text-foreground">{item.service}</span>
                                  <span className="rounded-md bg-accent px-1.5 py-0.5 font-semibold text-muted-foreground">
                                    {item._count.service}
                                  </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="rounded-xl border border-border/40 bg-card/60 p-5 shadow-sm">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                        <Clock className="h-4 w-4 text-neon" />
                        Recent Appointments
                      </h3>
                      <div className="space-y-2">
                        {stats.recentAppointments.slice(0, 5).map((apt) => (
                          <div
                            key={apt.id}
                            className="flex items-center justify-between rounded-xl bg-accent/40 px-3.5 py-3 transition-colors hover:bg-accent/60"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-foreground">{apt.name}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {apt.service} &middot; {apt.date} &middot; {apt.timeSlot}
                              </p>
                            </div>
                            <Badge
                              className="shrink-0 text-[10px] font-semibold"
                              style={{ border: 'none' }}
                            >
                              {apt.status}
                            </Badge>
                          </div>
                        ))}
                        {stats.recentAppointments.length === 0 && (
                          <div className="py-8 text-center">
                            <Inbox className="mx-auto mb-2 h-8 w-8 text-muted-foreground/25" />
                            <p className="text-sm text-muted-foreground">No appointments yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appointments' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{appointments.length}</span> total appointments
                      </p>
                    </div>

                    {appointments.length === 0 ? (
                      <div className="py-16 text-center">
                        <Inbox className="mx-auto mb-3 h-12 w-12 text-muted-foreground/20" />
                        <p className="text-sm font-medium text-muted-foreground">No appointments found</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">Appointments will appear here when customers book.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {appointments.map((apt) => (
                          <motion.div
                            key={apt.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="group flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/60 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">{apt.name}</p>
                                <Badge
                                  className="text-[10px] font-semibold"
                                  style={{ border: 'none' }}
                                >
                                  {apt.status}
                                </Badge>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                &phone; {apt.phone} &middot; &email; {apt.email || 'N/A'}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                &sheet; {apt.service} &middot; {apt.date} &middot; {apt.timeSlot}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAppointment(apt.id)}
                              className="h-9 w-9 shrink-0 rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'jobs' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{jobs.length}</span> job notifications
                      </p>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingJob(null);
                          setJobForm({ title: '', description: '', lastDate: '', status: 'active', applyUrl: '' });
                          setShowJobForm(true);
                        }}
                        className="gap-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Job
                      </Button>
                    </div>

                    {showJobForm && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-neon/20 bg-card/80 p-5 shadow-md"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <Zap className="h-4 w-4 text-neon" />
                            {editingJob ? 'Edit Job' : 'Add New Job'}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowJobForm(false)}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <form onSubmit={handleJobSubmit} className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Title *</Label>
                            <Input
                              value={jobForm.title}
                              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                              className="h-10 rounded-xl bg-foreground/5 text-sm"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Description *</Label>
                            <Textarea
                              value={jobForm.description}
                              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                              className="min-h-[80px] rounded-xl bg-foreground/5 text-sm"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs font-medium">Last Date</Label>
                              <Input
                                type="date"
                                value={jobForm.lastDate}
                                onChange={(e) => setJobForm({ ...jobForm, lastDate: e.target.value })}
                                className="h-10 rounded-xl bg-foreground/5 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium">Status</Label>
                              <Select value={jobForm.status} onValueChange={(v) => setJobForm({ ...jobForm, status: v })}>
                                <SelectTrigger className="h-10 rounded-xl bg-foreground/5 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                  <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Apply URL</Label>
                            <Input
                              value={jobForm.applyUrl}
                              onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })}
                              placeholder="https://..."
                              className="h-10 rounded-xl bg-foreground/5 text-sm"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowJobForm(false)}
                              className="rounded-lg text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              size="sm"
                              className="gap-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-xs text-white shadow-md shadow-teal-500/20"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {editingJob ? 'Update' : 'Create'}
                            </Button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {jobs.length === 0 ? (
                      <div className="py-16 text-center">
                        <Briefcase className="mx-auto mb-3 h-12 w-12 text-muted-foreground/20" />
                        <p className="text-sm font-medium text-muted-foreground">No job notifications</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">Click &quot;Add Job&quot; to create one.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {jobs.map((job) => (
                          <motion.div
                            key={job.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="group rounded-xl border border-border/40 bg-card/60 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <h4 className="font-semibold text-foreground">{job.title}</h4>
                                  <Badge
                                    className={`text-[10px] font-bold ${
                                      job.status === 'active'
                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                    }`}
                                    style={{ border: 'none' }}
                                  >
                                    {job.status}
                                  </Badge>
                                </div>
                                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{job.description}</p>
                                {job.lastDate && (
                                  <p className="mt-1.5 text-xs text-muted-foreground">
                                    Last Date: <span className="font-medium text-foreground">{job.lastDate}</span>
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditJob(job)}
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'slots' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-neon">{slots.filter((s) => s.enabled).length}</span> of{' '}
                        <span className="font-semibold text-foreground">{slots.length}</span> slots enabled
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {slots.map((slot) => (
                        <motion.div
                          key={slot.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`flex items-center justify-between rounded-xl border p-3.5 shadow-sm transition-all duration-200 ${
                            slot.enabled
                              ? 'border-neon/20 bg-neon/5 hover:shadow-md'
                              : 'border-border/30 bg-muted/30 opacity-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              slot.enabled ? 'bg-neon/10' : 'bg-muted'
                            }`}>
                              <Clock className={`h-4 w-4 ${slot.enabled ? 'text-neon' : 'text-muted-foreground'}`} />
                            </div>
                            <span className="text-sm font-medium text-foreground">{slot.slot}</span>
                          </div>
                          <button
                            onClick={() => handleToggleSlot(slot.id, slot.enabled)}
                            className="transition-transform duration-200 hover:scale-110"
                          >
                            {slot.enabled ? (
                              <ToggleRight className="h-7 w-7 text-neon" />
                            ) : (
                              <ToggleLeft className="h-7 w-7 text-muted-foreground" />
                            )}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
