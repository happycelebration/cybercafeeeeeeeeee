'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Mail,
  Briefcase,
  CheckCircle2,
  Loader2,
  CalendarCheck,
  Download,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SERVICES } from '@/lib/data';

interface TimeSlotConfig {
  id: string;
  slot: string;
  enabled: boolean;
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

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
}

interface BookingData {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
}

function openHtmlReceipt(booking: BookingData) {
  const bookingId = booking.id || `JC${Date.now().toString(36).toUpperCase()}`;

  let dateFormatted = booking.date;
  try {
    const d = new Date(booking.date + 'T00:00:00');
    dateFormatted = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {}

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>JassuCafe Receipt</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f4f8; display: flex; justify-content: center; padding: 20px; }
  .receipt { max-width: 600px; width: 100%; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
  .header { background: #0f172a; color: white; text-align: center; padding: 28px 20px; }
  .header h1 { font-size: 26px; letter-spacing: 2px; }
  .header p { color: #99f6e4; font-size: 13px; margin-top: 6px; }
  .badge { background: #059669; color: white; text-align: center; padding: 8px; font-weight: 700; font-size: 13px; letter-spacing: 1px; }
  .info-table { width: 100%; }
  .info-table .row { display: flex; border-bottom: 1px solid #e2e8f0; }
  .info-table .row:nth-child(even) { background: #f0fdfa; }
  .info-table .label { width: 30%; padding: 10px 16px; font-weight: 600; color: #0f766e; font-size: 13px; }
  .info-table .value { width: 70%; padding: 10px 16px; color: #0f172a; font-size: 14px; }
  .section-title { padding: 12px 16px; font-weight: 700; color: #0f172a; font-size: 14px; border-bottom: 2px solid #0d9488; }
  .customer .label { width: 30%; color: #94a3b8; font-size: 12px; font-weight: 400; }
  .customer .value { width: 70%; color: #0f172a; font-size: 14px; font-weight: 500; }
  .contact-header { background: #0d9488; color: white; text-align: center; padding: 10px; font-weight: 700; font-size: 13px; }
  .footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 14px; font-size: 11px; }
  .footer a { color: #99f6e4; text-decoration: none; }
  .wh-section { text-align: center; padding: 10px; background: #f1f5f9; }
  .wh-section .title { font-weight: 700; color: #0f766e; font-size: 12px; margin-bottom: 6px; }
  .wh-row { display: flex; border: 1px solid #e2e8f0; }
  .wh-row > div { flex: 1; padding: 8px; font-size: 12px; }
  .wh-row > div:first-child { font-weight: 600; color: #0f766e; text-align: center; }
  .wh-row > div:last-child { color: #475569; text-align: center; }
  @media print {
    body { background: white; padding: 0; }
    .no-print { display: none !important; }
    .receipt { box-shadow: none; border-radius: 0; }
  }
</style></head><body>
<div class="receipt">
  <div class="header"><h1>JASSU CAFE</h1><p>Your Trusted Digital Services Partner</p></div>
  <div class="badge">BOOKING CONFIRMED</div>
  <div class="info-table">
    <div class="row"><div class="label">Date</div><div class="value">${dateFormatted}</div></div>
    <div class="row"><div class="label">Time Slot</div><div class="value">${booking.timeSlot}</div></div>
    <div class="row"><div class="label">Service</div><div class="value">${booking.service}</div></div>
  </div>
  <div class="section-title">Customer Details</div>
  <div class="info-table customer">
    <div class="row"><div class="label">Full Name</div><div class="value">${booking.name}</div></div>
    <div class="row"><div class="label">Phone Number</div><div class="value">${booking.phone}</div></div>
    <div class="row"><div class="label">Email Address</div><div class="value">${booking.email || 'Not provided'}</div></div>
    <div class="row"><div class="label">Booking ID</div><div class="value">${bookingId}</div></div>
  </div>
  <div class="contact-header">Contact Information</div>
  <div class="info-table">
    <div class="row"><div class="label">Phone</div><div class="value">+91 89328 41664</div></div>
    <div class="row"><div class="label">Email</div><div class="value">jassucafe@gmail.com</div></div>
    <div class="row"><div class="label">Address</div><div class="value">KDT Plaza, UGF 44, Aliganj, Lucknow, U.P. 226021</div></div>
  </div>
  <div class="wh-section"><div class="title">Working Hours</div>
    <div class="wh-row"><div>Monday - Saturday</div><div>9:00 AM - 8:00 PM</div></div>
    <div class="wh-row"><div>Sunday</div><div>10:00 AM - 4:00 PM</div></div>
  </div>
  <div class="footer">
    JassuCafe | KDT Plaza, UGF 44, Aliganj, Lucknow, U.P. 226021<br>
    +91 89328 41664 | jassucafe@gmail.com
  </div>
</div>
<div class="no-print" style="text-align:center;margin-top:16px;">
  <button onclick="window.print()" style="background:#0d9488;color:white;border:none;padding:12px 32px;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-right:8px;">Print / Save as PDF</button>
  <button onclick="window.close()" style="background:#64748b;color:white;border:none;padding:12px 24px;border-radius:10px;font-size:15px;cursor:pointer;">Close</button>
</div>
</body></html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

export default function BookingSection() {
  const [form, setForm] = useState<BookingForm>({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    timeSlot: '',
  });
  const [slotConfigs, setSlotConfigs] = useState<TimeSlotConfig[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<BookingForm>>({});
  const [lastBooking, setLastBooking] = useState<BookingData | null>(null);

  const fetchSlotData = useCallback(async () => {
    if (!form.date) {
      setSlotConfigs([]);
      setBookedSlots([]);
      return;
    }
    setLoading(true);
    try {
      const [slotsRes, appointmentsRes] = await Promise.all([
        fetch('/api/slots'),
        fetch(`/api/appointments?date=${form.date}`),
      ]);
      if (slotsRes.ok) {
        const slotsData = await slotsRes.json();
        setSlotConfigs(slotsData);
      }
      if (appointmentsRes.ok) {
        const appts = await appointmentsRes.json();
        setBookedSlots(appts.map((a: Appointment) => a.timeSlot));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [form.date]);

  useEffect(() => {
    fetchSlotData();
  }, [fetchSlotData]);

  const validate = (): boolean => {
    const errors: Partial<BookingForm> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) errors.phone = 'Enter valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Enter valid email';
    if (!form.service) errors.service = 'Select a service';
    if (!form.date) errors.date = 'Select a date';
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(form.date) < today) errors.date = 'Cannot book past dates';
    }
    if (!form.timeSlot) errors.timeSlot = 'Select a time slot';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to book appointment');
        return;
      }

      setLastBooking({
        id: data.id,
        name: form.name,
        phone: form.phone,
        email: form.email,
        service: form.service,
        date: form.date,
        timeSlot: form.timeSlot,
      });

      setSuccess(true);
      setForm({ name: '', phone: '', email: '', service: '', date: '', timeSlot: '' });
      fetchSlotData();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!lastBooking) return;
    setDownloading(true);
    setError('');

    try {
      const res = await fetch('/api/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lastBooking),
      });

      if (!res.ok) {
        openHtmlReceipt(lastBooking);
        setDownloading(false);
        return;
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/pdf')) {
        openHtmlReceipt(lastBooking);
        setDownloading(false);
        return;
      }

      const blob = await res.blob();
      if (blob.size < 100) {
        openHtmlReceipt(lastBooking);
        setDownloading(false);
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `JassuCafe_Receipt_${lastBooking.date}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 500);
    } catch {
      openHtmlReceipt(lastBooking);
    } finally {
      setDownloading(false);
    }
  };

  const handleBookAnother = () => {
    setSuccess(false);
    setLastBooking(null);
    setError('');
  };

  const isSlotAvailable = (slot: string) => {
    const config = slotConfigs.find((s) => s.slot === slot);
    if (!config || !config.enabled) return false;
    if (bookedSlots.includes(slot)) return false;
    return true;
  };

  const isSlotBooked = (slot: string) => bookedSlots.includes(slot);
  const isSlotDisabled = (slot: string) => {
    const config = slotConfigs.find((s) => s.slot === slot);
    return !config || !config.enabled;
  };

  const today = new Date().toISOString().split('T')[0];

  const availableSlotCount = slotConfigs.filter(
    (s) => s.enabled && !bookedSlots.includes(s.slot)
  ).length;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="booking" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10" style={{
        background:
          'radial-gradient(ellipse 60% 50% at 80% 40%, rgba(20,184,166,0.07) 0%, transparent 70%), ' +
          'radial-gradient(ellipse 50% 50% at 15% 65%, rgba(16,185,129,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-neon/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-neon">
            <CalendarCheck className="h-3.5 w-3.5" />
            Book Now
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Book Your{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              Appointment
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Select your preferred date and time slot. It&apos;s quick and easy!
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card neon-border mx-auto max-w-lg rounded-2xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30"
              >
                <CheckCircle2 className="h-8 w-8 text-white" />
              </motion.div>

              <h3 className="mb-2 text-xl font-bold text-foreground">Appointment Booked!</h3>
              <p className="mb-5 text-sm text-muted-foreground">
                Your appointment has been successfully confirmed. Thank you for choosing JassuCafe!
              </p>

              {lastBooking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 p-4 text-left dark:from-teal-950/30 dark:to-emerald-950/30"
                >
                  <div className="mb-3 flex items-center gap-2 border-b border-teal-200/50 pb-2 dark:border-teal-800/50">
                    <CalendarCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Booking Summary</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name</span>
                      <p className="font-medium text-foreground">{lastBooking.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone</span>
                      <p className="font-medium text-foreground">{lastBooking.phone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Service</span>
                      <p className="font-medium text-foreground">{lastBooking.service}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date</span>
                      <p className="font-medium text-foreground">{formatDate(lastBooking.date)}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Time Slot</span>
                      <p className="font-medium text-foreground">{lastBooking.timeSlot}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  onClick={handleDownloadReceipt}
                  disabled={downloading}
                  className="gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 px-6 text-white shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 disabled:opacity-60"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Receipt...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Receipt
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => lastBooking && openHtmlReceipt(lastBooking)}
                  variant="outline"
                  className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-950/50"
                >
                  <FileText className="h-4 w-4" />
                  View Receipt
                </Button>
                <Button
                  onClick={handleBookAnother}
                  variant="outline"
                  className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-950/50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Book Another
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="glass-card neon-border rounded-2xl p-6 sm:p-8"
            >
              <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                  <User className="h-5 w-5 text-neon" />
                  Personal Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-11 rounded-xl bg-background/50"
                    />
                    {formErrors.name && (
                      <p className="text-xs text-destructive">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="10-digit number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-11 rounded-xl bg-background/50 pl-10"
                        maxLength={10}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-destructive">{formErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="h-11 rounded-xl bg-background/50 pl-10"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-xs text-destructive">{formErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                  <Briefcase className="h-5 w-5 text-neon" />
                  Service & Schedule
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">
                      Service <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.service}
                      onValueChange={(val) => setForm({ ...form, service: val })}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-background/50">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((s) => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name} {s.price ? `(${s.price})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.service && (
                      <p className="text-xs text-destructive">{formErrors.service}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-sm font-medium text-foreground">
                      Date <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        min={today}
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value, timeSlot: '' })}
                        className="h-11 rounded-xl bg-background/50 pl-10"
                      />
                    </div>
                    {formErrors.date && (
                      <p className="text-xs text-destructive">{formErrors.date}</p>
                    )}
                  </div>
                </div>
              </div>

              {form.date && (
                <div className="mb-6">
                  <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-foreground">
                    <Clock className="h-5 w-5 text-neon" />
                    Select Time Slot
                  </h3>
                  <p className="mb-4 text-xs text-muted-foreground">
                    {loading ? (
                      'Loading slots...'
                    ) : (
                      <>
                        {availableSlotCount} slot{availableSlotCount !== 1 ? 's' : ''} available
                        for {new Date(form.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                      </>
                    )}
                  </p>

                  {loading ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-11 animate-pulse rounded-xl bg-muted"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {slotConfigs.map((slotConfig) => {
                        const available = isSlotAvailable(slotConfig.slot);
                        const booked = isSlotBooked(slotConfig.slot);
                        const disabled = isSlotDisabled(slotConfig.slot);
                        const selected = form.timeSlot === slotConfig.slot;

                        return (
                          <motion.button
                            key={slotConfig.id}
                            type="button"
                            disabled={!available}
                            whileTap={available && !selected ? { scale: 0.95 } : undefined}
                            onClick={() => available && setForm({ ...form, timeSlot: slotConfig.slot })}
                            className={`h-11 rounded-xl text-sm font-medium transition-all duration-200 ${
                              selected
                                ? 'slot-selected font-bold'
                                : available
                                ? 'slot-available cursor-pointer text-foreground'
                                : disabled
                                ? 'slot-booked text-muted-foreground'
                                : 'slot-booked'
                            }`}
                          >
                            {disabled ? (
                              <span className="flex items-center justify-center gap-1">
                                <span className="text-[10px]">&#10005;</span>
                                <span className="truncate">{slotConfig.slot}</span>
                              </span>
                            ) : booked ? (
                              <span className="flex items-center justify-center gap-1">
                                <span className="text-[10px] opacity-60">&#9679;</span>
                                <span className="truncate opacity-60">{slotConfig.slot}</span>
                              </span>
                            ) : (
                              <span className="truncate">{slotConfig.slot}</span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {formErrors.timeSlot && (
                    <p className="mt-2 text-xs text-destructive">{formErrors.timeSlot}</p>
                  )}
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-base font-semibold text-white shadow-lg shadow-teal-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarCheck className="mr-2 h-5 w-5" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
