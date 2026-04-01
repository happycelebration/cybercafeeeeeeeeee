'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Minus, X, SendHorizontal, Trash2 } from 'lucide-react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hello! I'm the JassuCafe Assistant. How can I help you today?\n\nYou can ask me about our **services**, **pricing**, **booking**, or anything else!",
  timestamp: new Date(),
};

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotWindow({ isOpen, onClose }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    const userMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const apiMessages = [
        ...messages.filter((m) => m !== WELCOME_MESSAGE || messages[0] === WELCOME_MESSAGE).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user' as const, content: userMessage },
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-4 z-50 flex h-[520px] max-h-[70vh] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl sm:right-6"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-[#0f766e] to-[#0d9488] px-4 py-3.5 shadow-lg">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">JassuCafe Assistant</h3>
                <p className="flex items-center gap-1.5 text-xs text-teal-100/80">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online &bull; Ready to help
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Minimize"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-3 scrollbar-thin"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--neon-dim) transparent' }}
            >
              {messages.length > 1 && (
                <div className="flex justify-end">
                  <button
                    onClick={clearChat}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6875rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear Chat
                  </button>
                </div>
              )}

              {messages.map((msg, idx) => (
                <ChatBubble
                  key={idx}
                  message={msg.content}
                  isUser={msg.role === 'user'}
                  timestamp={msg.timestamp}
                />
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-border bg-background px-3 py-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="Type a message..."
                  className="h-10 flex-1 rounded-xl border border-border bg-background/60 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon/40 focus:outline-none focus:ring-1 focus:ring-neon/30 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
