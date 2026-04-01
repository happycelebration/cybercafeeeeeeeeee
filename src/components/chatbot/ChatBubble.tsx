'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(<strong key={key++}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [<span key={0}>{text}</span>];
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === '') {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    if (trimmed.startsWith('- ')) {
      elements.push(
        <div key={`li-${i}`} className="ml-3 flex gap-2">
          <span className="mt-1.5 shrink-0 text-teal-500/60">&#8226;</span>
          <span>{renderInline(trimmed.slice(2))}</span>
        </div>,
      );
      continue;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
    if (numMatch) {
      elements.push(
        <div key={`oli-${i}`} className="ml-3 flex gap-2">
          <span className="shrink-0 font-medium text-teal-600 dark:text-teal-400">{numMatch[1]}.</span>
          <span>{renderInline(numMatch[2])}</span>
        </div>,
      );
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInline(trimmed)}
      </p>,
    );
  }

  return elements;
}

export default function ChatBubble({ message, isUser, timestamp }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'rounded-2xl rounded-br-md bg-gradient-to-br from-teal-600 to-emerald-600 px-4 py-2.5 text-white shadow-md shadow-teal-500/20'
            : 'rounded-2xl rounded-bl-md border border-border bg-muted px-4 py-2.5 text-foreground'
        }`}
      >
        <div className={`text-[0.875rem] leading-relaxed whitespace-pre-wrap ${isUser ? 'font-medium' : ''}`}>
          {renderMarkdown(message)}
        </div>
        {timestamp && (
          <p className={`mt-1 text-right text-[0.625rem] ${isUser ? 'text-white/60' : 'text-muted-foreground'}`}>
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
