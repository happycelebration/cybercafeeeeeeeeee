'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface ChatbotButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatbotButton({ onClick, isOpen }: ChatbotButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-shadow duration-300 ${
        isOpen
          ? 'bg-gradient-to-br from-slate-600 to-slate-700 shadow-slate-500/30 hover:shadow-xl hover:shadow-slate-500/40'
          : 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40'
      } ${!isOpen ? 'animate-[neonPulse_2s_ease-in-out_infinite]' : ''}`}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="h-6 w-6 text-white" />
          </motion.span>
        ) : (
          <motion.span
            key="chat"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
