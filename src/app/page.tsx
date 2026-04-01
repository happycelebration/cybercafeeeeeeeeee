'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import JobsSection from '@/components/sections/JobsSection';
import BookingSection from '@/components/sections/BookingSection';
import Footer from '@/components/sections/Footer';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ChatbotButton from '@/components/chatbot/ChatbotButton';
import ChatbotWindow from '@/components/chatbot/ChatbotWindow';
import { useAdminStore } from '@/lib/admin-store';

type AdminView = 'closed' | 'login' | 'dashboard';

export default function HomePage() {
  const [adminView, setAdminView] = useState<AdminView>('closed');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const hydrate = useAdminStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleAdminClick = () => {
    setAdminView(isAdmin ? 'dashboard' : 'login');
  };

  const adminViewComputed = adminView === 'login' && isAdmin ? 'dashboard' as const : adminView;

  const handleLogin = (email: string, name: string, token: string) => {
    useAdminStore.getState().login(email, name, token);
    setAdminView('dashboard');
  };

  const handleCloseAdmin = () => {
    setAdminView('closed');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onAdminClick={handleAdminClick} isAdmin={isAdmin} />

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <JobsSection />
        <BookingSection />
      </main>

      <Footer />

      <AnimatePresence mode="wait">
        {adminViewComputed === 'login' && (
          <AdminLogin
            key="login"
            onLogin={handleLogin}
            onBack={handleCloseAdmin}
          />
        )}
        {adminViewComputed === 'dashboard' && (
          <AdminDashboard
            key="dashboard"
            onClose={handleCloseAdmin}
          />
        )}
      </AnimatePresence>

      <ChatbotButton
        onClick={() => setIsChatOpen((prev) => !prev)}
        isOpen={isChatOpen}
      />
      <ChatbotWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
