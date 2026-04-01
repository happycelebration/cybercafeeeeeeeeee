'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onAdminClick: () => void;
  isAdmin: boolean;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Jobs', href: '#jobs' },
  { label: 'Book Now', href: '#booking' },
  { label: 'Contact', href: '#contact' },
];

const emptySubscribe = () => () => {};

export default function Navbar({ onAdminClick, isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-18">

          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-500/20">
              <MonitorSmartphone className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Jassu<span className="text-neon">Cafe</span>
            </span>
          </motion.div>


          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </div>


          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 rounded-lg"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button
              variant={isAdmin ? 'default' : 'ghost'}
              size="sm"
              onClick={onAdminClick}
              className="gap-1.5 rounded-lg"
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isAdmin ? 'Dashboard' : 'Admin'}</span>
            </Button>


            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-strong border-t border-border/50 lg:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onAdminClick();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Shield className="h-4 w-4" />
                {isAdmin ? 'Admin Dashboard' : 'Admin Login'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
