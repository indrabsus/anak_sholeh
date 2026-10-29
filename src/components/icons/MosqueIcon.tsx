import React from "react";

export function MosqueIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Crescent on top */}
      <path d="M12 2a1.5 1.5 0 0 1 1 1.4c0 .8-.6 1.4-1.4 1.4-.2 0-.4 0-.6-.1.5.8 1.4 1.3 2.5 1.3 1.7 0 3-1.3 3-3 0-.4-.1-.7-.2-1 .9.5 1.7 1.4 1.7 2.5 0 1.9-1.6 3.5-3.5 3.5H9.5C7.6 8 6 6.4 6 4.5c0-1.1.8-2 1.7-2.5-.1.3-.2.6-.2 1 0 1.7 1.3 3 3 3 1.1 0 2-.5 2.5-1.3-.2.1-.4.1-.6.1-.8 0-1.4-.6-1.4-1.4 0-.6.4-1.2 1-1.4z" />
      {/* Minarets and Main Dome */}
      <path d="M4 21V10l2-2 2 2v11" />
      <path d="M16 21V10l2-2 2 2v11" />
      <path d="M8 21v-8a4 4 0 0 1 8 0v8" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
      <line x1="2" y1="21" x2="22" y2="21" />
    </svg>
  );
}
