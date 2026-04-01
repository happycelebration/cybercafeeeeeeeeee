'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Award,
  Target,
  MessageCircle,
  ExternalLink,
  Navigation,
  Timer,
} from 'lucide-react';
import { CAFE_INFO } from '@/lib/data';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const contactCards = [
  {
    icon: Phone,
    label: 'Call Now',
    value: CAFE_INFO.phone,
    href: `tel:${CAFE_INFO.phone.replace(/\s/g, '')}`,
    gradient: 'from-teal-500 to-emerald-600',
    shadowColor: 'shadow-teal-500/25',
    description: 'Tap to call directly',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: CAFE_INFO.phone,
    href: CAFE_INFO.social.whatsapp,
    gradient: 'from-green-500 to-emerald-600',
    shadowColor: 'shadow-green-500/25',
    description: 'Chat with us on WhatsApp',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: CAFE_INFO.email,
    href: `mailto:${CAFE_INFO.email}`,
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/25',
    description: 'Send us an email',
  },
  {
    icon: Navigation,
    label: 'Get Directions',
    value: CAFE_INFO.address,
    href: 'https://www.google.com/maps/place/Jassu+Cyber+Cafe+And+Travels,+KDT+Plaza,+Ugf+44,+Aliganj,+Lucknow,+Uttar+Pradesh+226024/@26.9049788,80.9437358,15z/data=!4m6!3m5!1s0x399957cac7f492f9:0x58a62f3265e00c4d!8m2!3d26.9049788!4d80.9437358!16s%2Fg%2F11btv69qt9',
    gradient: 'from-rose-500 to-pink-600',
    shadowColor: 'shadow-rose-500/25',
    description: 'Open in Google Maps',
  },
  {
    icon: Timer,
    label: 'Working Hours',
    value: CAFE_INFO.workingHours,
    href: null,
    gradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/25',
    description: 'Our business hours',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10" style={{
        background:
          'radial-gradient(ellipse 60% 50% at 15% 50%, rgba(20,184,166,0.08) 0%, transparent 70%), ' +
          'radial-gradient(ellipse 50% 50% at 85% 30%, rgba(16,185,129,0.06) 0%, transparent 70%)',
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
            About Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get To Know{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              JassuCafe
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Serving the community with reliable digital services for over a decade
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="glass-card neon-border mx-auto mb-10 max-w-lg rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-5 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 opacity-60 blur-md" />
              <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-xl ring-4 ring-white dark:ring-slate-900 sm:h-36 sm:w-36">
                <Image
                  src="/owner-profile.png"
                  alt={CAFE_INFO.owner}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 128px, 144px"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-foreground">{CAFE_INFO.owner}</h3>
            <p className="mt-1 text-sm font-medium text-neon">Owner & Operator</p>
            <p className="mx-auto mt-1.5 mb-4 inline-block rounded-full bg-neon/10 px-3 py-0.5 text-xs font-semibold text-neon">
              {CAFE_INFO.experience} of Experience
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              With hands-on expertise in digital services and customer satisfaction, I&apos;ve
              built this cafe into the most trusted digital service center in Lucknow. Every
              customer walks in with a need and walks out with a smile.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h3 className="mb-5 text-center text-lg font-bold text-foreground">
            Reach Out to Us
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            className="mx-auto grid max-w-3xl grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-5"
          >
            {contactCards.map((card) => {
              const Icon = card.icon;
              const Wrapper = card.href ? 'a' : 'div';
              const wrapperProps = card.href
                ? {
                    href: card.href,
                    target: card.href.startsWith('http') ? '_blank' : undefined,
                    rel: card.href.startsWith('http') ? 'noopener noreferrer' : undefined,
                  }
                : {};

              return (
                <motion.div key={card.label} variants={itemVariants}>
                  <Wrapper
                    {...wrapperProps}
                    className={`glass-card group flex flex-col items-center gap-2 rounded-xl px-3 py-3 text-center transition-all duration-300 ${
                      card.href
                        ? 'cursor-pointer hover:shadow-lg hover:shadow-neon/10 hover:-translate-y-0.5 active:scale-[0.97]'
                        : ''
                    }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${card.gradient} shadow-md ${card.shadowColor} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>

                    <div className="min-w-0 w-full">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-foreground truncate">
                        {card.label === 'Get Directions'
                          ? 'View on Map'
                          : card.label === 'Working Hours'
                          ? 'Mon–Sat 9–8'
                          : card.value}
                      </p>
                      {card.label === 'Get Directions' && (
                        <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1 leading-tight">
                          {card.value}
                        </p>
                      )}
                    </div>

                    {card.href && (
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-50" />
                    )}
                  </Wrapper>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants} className="glass-card neon-border rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground">Our Mission</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{CAFE_INFO.mission}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card neon-border rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground">Quality Assured</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every document is handled with care, every form is verified before submission,
              and every customer receives personalized attention.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card neon-border rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground">Quick Service</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Most services completed within minutes. No long queues. Walk in, get served,
              walk out happy.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card neon-border rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground">Trusted Partner</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Recognized for honest and transparent service. We never overcharge and always
              keep you informed about your applications.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
