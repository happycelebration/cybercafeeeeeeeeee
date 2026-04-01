'use client';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md border border-border bg-muted px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 animate-[typingBounce_1.4s_ease-in-out_infinite] rounded-full bg-teal-500" />
          <span className="inline-block h-2 w-2 animate-[typingBounce_1.4s_ease-in-out_infinite_0.2s] rounded-full bg-teal-500" />
          <span className="inline-block h-2 w-2 animate-[typingBounce_1.4s_ease-in-out_infinite_0.4s] rounded-full bg-teal-500" />
        </div>
      </div>
    </div>
  );
}
