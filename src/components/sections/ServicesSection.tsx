'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Fingerprint,
  BookOpen,
  FileText,
  GraduationCap,
  FileOutput,
  Printer,
  Copy,
  Briefcase,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { SERVICES, type ServiceItem } from '@/lib/data';

const iconMap: Record<string, React.ElementType> = {
  CreditCard,
  Fingerprint,
  BookOpen,
  FileText,
  GraduationCap,
  FileOutput,
  Printer,
  Copy,
  Briefcase,
  Award,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10" style={{
        background:
          'radial-gradient(ellipse 50% 50% at 80% 30%, rgba(20,184,166,0.07) 0%, transparent 70%), ' +
          'radial-gradient(ellipse 50% 50% at 15% 70%, rgba(16,185,129,0.06) 0%, transparent 70%)',
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
          <span className="mb-3 inline-block rounded-full bg-neon/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-neon">
            Our Services
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Digital Services{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              We Offer
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Comprehensive digital solutions for all your government and personal documentation needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.icon] || FileText;
            const isSelected = selectedService?.id === service.id;

            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                onClick={() =>
                  setSelectedService(isSelected ? null : service)
                }
                className={`glass-card cursor-pointer rounded-2xl p-5 transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-neon shadow-lg shadow-neon/10'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 ${
                      isSelected
                        ? 'from-teal-500 to-emerald-600 shadow-teal-500/30'
                        : 'from-teal-500/80 to-emerald-600/80 shadow-teal-500/15'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-foreground">{service.name}</h3>
                      {service.price && (
                        <span className="shrink-0 rounded-lg bg-neon/10 px-2 py-0.5 text-xs font-semibold text-neon">
                          {service.price}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-neon">
                  {isSelected ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      View Details
                    </>
                  )}
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 rounded-xl bg-accent/50 p-4">
                        <div className="mb-2 flex items-center gap-1.5">
                          <FileCheck className="h-3.5 w-3.5 text-neon" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-neon">
                            Required Documents
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {service.documents.map((doc, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-neon/70" />
                              {doc}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
