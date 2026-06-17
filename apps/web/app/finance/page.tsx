"use client";

import React from 'react';
import { motion } from 'framer-motion';
import BlurText from '../../components/BlurText';

export default function FinancePage() {
  return (
    <main className="h-screen w-full relative flex flex-col justify-between items-center overflow-hidden bg-black select-none font-body py-8 md:py-12 px-6">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #fc920d 0%, #97192c 40%, transparent 70%)',
        }}
      />

      {/* Top Navbar — consistent with hero */}
      <nav className="fixed top-6 left-0 right-0 px-8 lg:px-16 z-50 flex items-center justify-between pointer-events-none">
        <a href="/" className="flex items-center gap-3 pointer-events-auto">
          <img
            src="https://gobitsnbytes.org/logo"
            alt="bits&bytes™ logo"
            className="h-8 w-auto select-none"
          />
          <span className="font-heading font-black text-lg tracking-wider text-white">
            motherboard
          </span>
        </a>
        <div className="flex items-center gap-2 bg-orange/20 border border-orange/30 text-orange px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full pointer-events-auto select-none">
          <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
          In Development
        </div>
      </nav>

      {/* Centered Coming Soon Card */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-[1.5rem] p-8 md:p-10 flex flex-col items-center text-center w-full shadow-2xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.035)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: "rgba(252, 146, 13, 0.1)", border: "1px solid rgba(252, 146, 13, 0.2)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fc920d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </motion.div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-none tracking-tight mb-3">
            <BlurText text="Finance Module" />
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-white/70 font-body leading-relaxed mb-8 max-w-xs">
            the finance operations module is currently under active development and will be available soon
          </p>

          {/* Coming Soon Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="px-6 py-2.5 rounded-full font-heading text-xs font-bold uppercase tracking-[0.2em] mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(151, 25, 44, 0.4), rgba(252, 146, 13, 0.3))',
              border: '1px solid rgba(252, 146, 13, 0.25)',
              color: '#fc920d',
            }}
          >
            Coming Soon
          </motion.div>

          {/* Planned Features */}
          <div className="flex flex-col gap-3 w-full border-t border-white/10 pt-6 text-xs text-white/70">
            <span className="font-heading uppercase tracking-wider text-orange font-bold text-[10px] mb-1">
              Planned Capabilities
            </span>
            {[
              ['Budget Tracking', 'Fork-level budget allocation and monitoring'],
              ['Expense Reports', 'Submit and approve reimbursements'],
              ['Financial Reports', 'Revenue, expenses, and audit trails'],
            ].map(([title, desc]) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + (title === 'Budget Tracking' ? 0 : title === 'Expense Reports' ? 0.1 : 0.2) }}
                className="flex items-start gap-3 px-1 text-left"
              >
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange/60 shrink-0" />
                <div>
                  <span className="font-heading font-semibold text-white block">{title}</span>
                  <span className="font-body text-white/50 text-[11px]">{desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-[10px] text-white/40 font-heading tracking-widest uppercase text-center mt-auto pt-4 border-t border-burgundy/5 w-full max-w-md">
        <div>built with ❤️ by the techies of bits&bytes™</div>
      </footer>
    </main>
  );
}
