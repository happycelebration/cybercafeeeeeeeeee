'use client';

import { motion } from 'framer-motion';
import { CalendarCheck, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-teal-50/60 to-slate-100 dark:from-[#060b14] dark:via-[#080f1a] dark:to-[#0a1218]" />

        <div className="absolute inset-0" style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(20,184,166,0.18) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 70% 50% at 20% 60%, rgba(6,182,212,0.15) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.10) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 90% 70% at 80% 80%, rgba(20,184,166,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />

        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neon/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neon ring-1 ring-neon/20 animate-neon-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Trusted by 10,000+ Customers
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block">Your Digital</span>
          <span className="neon-text bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
            Services Partner
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl"
        >
          From PAN Card applications to Government Forms, Job Applications to Passport Services
          — we handle all your digital needs with expertise and care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button
            size="lg"
            onClick={() => handleScrollTo('#booking')}
            className="group relative h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 text-base font-semibold text-white shadow-lg shadow-teal-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 hover:brightness-110 sm:w-auto"
          >
            <CalendarCheck className="h-5 w-5" />
            Book Appointment
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-20" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => handleScrollTo('#services')}
            className="h-12 w-full rounded-xl px-8 text-base font-semibold transition-all duration-300 hover:bg-accent sm:w-auto"
          >
            View Services
            <ChevronDown className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
        >
          {[
            { value: '12+', label: 'Years Experience' },
            { value: '10K+', label: 'Happy Customers' },
            { value: '50+', label: 'Services Offered' },
            { value: '99%', label: 'Satisfaction Rate' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl px-4 py-3">
              <div className="text-xl font-bold text-neon sm:text-2xl">{stat.value}</div>
              <div className="text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
