'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface JobNotification {
  id: string;
  title: string;
  description: string;
  lastDate: string | null;
  status: string;
  applyUrl: string | null;
  createdAt: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function JobsSection() {
  const [jobs, setJobs] = useState<JobNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const getDaysRemaining = (lastDate: string | null) => {
    if (!lastDate) return null;
    const now = new Date();
    const end = new Date(lastDate);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section id="jobs" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10" style={{
        background:
          'radial-gradient(ellipse 50% 50% at 25% 20%, rgba(20,184,166,0.07) 0%, transparent 70%), ' +
          'radial-gradient(ellipse 50% 50% at 75% 80%, rgba(245,158,11,0.05) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-neon/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-neon">
            <Zap className="h-3.5 w-3.5" />
            Live Updates
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Active Job{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              Notifications
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Stay updated with the latest government job openings and recruitment notifications
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {jobs.map((job) => {
              const daysLeft = getDaysRemaining(job.lastDate);
              const isUrgent = daysLeft !== null && daysLeft <= 15 && daysLeft >= 0;

              return (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  className="glass-card neon-border group relative overflow-hidden rounded-2xl p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Badge
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        job.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      }`}
                      style={{ border: 'none' }}
                    >
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current animate-neon-pulse" />
                      {job.status}
                    </Badge>
                    {isUrgent && (
                      <Badge className="border-amber-500/20 bg-amber-500/10 text-[10px] font-bold text-amber-600 dark:text-amber-400" style={{ border: 'none' }}>
                        Urgent
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-2 text-base font-bold leading-snug text-foreground">
                    {job.title}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {job.description}
                  </p>

                  {job.lastDate && (
                    <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-neon" />
                      <span>
                        Last Date:{' '}
                        <span className="font-medium text-foreground">
                          {formatDate(job.lastDate)}
                        </span>
                      </span>
                      {daysLeft !== null && (
                        <span
                          className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            daysLeft < 0
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : daysLeft <= 15
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {daysLeft < 0 ? 'Expired' : `${daysLeft}d left`}
                        </span>
                      )}
                    </div>
                  )}

                  {job.applyUrl && job.applyUrl !== '#' ? (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-teal-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/30 hover:brightness-110"
                    >
                      Apply Now
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-foreground">
                      Visit Us to Apply
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
