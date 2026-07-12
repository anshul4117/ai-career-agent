"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-12 select-none overflow-hidden">
      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#auth-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-surface brutal-border"
      >
        Skip to form content
      </a>

      {/* Subtle Brutalist Background Grid Overlay */}
      <div className="absolute inset-0 -z-10 select-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full stroke-foreground/[0.025] text-foreground/[0.025] fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      {/* Centered Main Form Container */}
      <motion.main 
        id="auth-content" 
        className="w-full max-w-md z-10 flex flex-col justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
