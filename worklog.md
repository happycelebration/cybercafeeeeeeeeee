---
Task ID: fix-supabase-only-telegram-jobs
Agent: main
Task: Fix 3 issues - Supabase-only storage, remove chat Telegram, fix job persistence/update

Work Log:
- Found .gitignore had `.env*` which excluded BOTH `.env` and `.env.example` from git — this was why the user never got env files when downloading
- Fixed .gitignore to only exclude `.env`, `.env.local`, `.env.production.local`, `.env.development.local` — `.env.example` is now included
- Rewrote src/lib/storage.ts to be PURE Supabase — zero in-memory fallback, zero Map storage, zero localStorage. All data goes directly to Supabase tables
- Removed src/lib/supabaseClient.ts (no longer needed, storage.ts creates client directly)
- Removed Telegram notification from src/app/api/chat/route.ts — chatbot messages NO LONGER go to Telegram
- Fixed src/app/api/appointments/route.ts — removed HTTP call to /api/telegram, now calls sendTelegramNotification directly with a well-formatted appointment booking message including all fields
- Updated supabase-setup.sql header to say "REQUIRED" instead of "OPTIONAL"
- Updated .env.example with clear "REQUIRED" Supabase instructions
- Fixed job status update: updateJob now uses direct Supabase .update() with proper patch construction
- Zero lint errors

Stage Summary:
- App is STRICTLY Supabase-only — no in-memory, no localStorage, no Prisma, no SQLite
- Chatbot messages are private — nothing sent to Telegram
- Only APPOINTMENT BOOKINGS trigger Telegram notification to owner (well-formatted)
- Job notifications persist in Supabase and can be updated (active/closed/expired)
- .env.example is now included in the downloadable project
- Admin login: admin@jassucafe.com / admin123
