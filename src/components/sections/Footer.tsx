'use client';

import {
  MonitorSmartphone,
  Heart,
  ArrowUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative mt-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />

      <div className="glass-strong">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-500/20">
                <MonitorSmartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Jassu<span className="text-neon">Cafe</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your trusted digital services partner. We help you with all government and personal
              digital documentation needs. Walk in with a need, walk out with a smile.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 border-t border-border/50 pt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="gap-1 text-xs text-muted-foreground hover:text-neon"
            >
              Back to Top
              <ArrowUp className="h-3 w-3" />
            </Button>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} JassuCafe. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
              <span>by Dev &amp; Anony</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
