import React from 'react';

export default function NotFound() {
  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white font-body">
      <h1 className="text-4xl font-heading font-black mb-4">404</h1>
      <p className="text-sm text-white/60 mb-6">Page not found.</p>
      <a href="/" className="text-xs uppercase tracking-wider text-orange hover:underline font-heading font-semibold">
        Back to Home
      </a>
    </main>
  );
}
