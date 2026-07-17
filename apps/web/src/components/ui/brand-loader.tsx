"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { 
  Briefcase, 
  Laptop, 
  Code, 
  FileText, 
  Building2, 
  Rocket, 
  Target, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullscreen?: boolean;
  className?: string;
}

const ICONS = [
  Briefcase,
  Laptop,
  Code,
  FileText,
  Building2,
  Rocket,
  Target,
  Sparkles
];

export function BrandLoader({
  size = "md",
  label,
  fullscreen = false,
  className
}: BrandLoaderProps) {
  const shouldReduceMotion = useReducedMotion();

  // Size configurations
  const sizeMap = {
    sm: {
      container: 80,
      logo: 24,
      radius: 28,
      icon: 12,
      strokeWidth: 2.5
    },
    md: {
      container: 144,
      logo: 40,
      radius: 52,
      icon: 16,
      strokeWidth: 2.2
    },
    lg: {
      container: 240,
      logo: 64,
      radius: 90,
      icon: 22,
      strokeWidth: 2
    }
  };

  const config = sizeMap[size];

  // Animation values
  const rotationDuration = 12; // seconds for full orbit loop
  
  const content = (
    <div className={cn("flex flex-col items-center justify-center select-none text-center", className)}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: config.container, height: config.container }}
      >
        {/* Glow backdrop behind center logo */}
        <motion.div
          animate={shouldReduceMotion ? { opacity: 0.6 } : {
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-primary/15 blur-xl pointer-events-none"
          style={{
            width: config.logo * 1.8,
            height: config.logo * 1.8
          }}
        />

        {/* Center Logo Icon */}
        <motion.div
          animate={shouldReduceMotion ? {} : {
            scale: [0.96, 1.04, 0.96]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
          className="absolute z-10 flex items-center justify-center bg-surface border-[2px] border-black dark:border-border rounded-full p-1 brutal-shadow-xs"
          style={{ width: config.logo, height: config.logo }}
        >
          <Image
            src="/favicon.svg"
            alt="ACA Icon"
            width={config.logo}
            height={config.logo}
            priority
            className="w-[85%] h-[85%] object-contain rounded-full"
          />
        </motion.div>

        {/* Orbit Rotating Container */}
        <motion.div
          animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: rotationDuration
          }}
          className="absolute inset-0 w-full h-full"
        >
          {ICONS.map((IconComponent, idx) => {
            const angle = (2 * Math.PI * idx) / ICONS.length;
            const x = config.radius * Math.cos(angle);
            const y = config.radius * Math.sin(angle);

            return (
              <div
                key={idx}
                className="absolute flex items-center justify-center"
                style={{
                  left: `calc(50% + ${x}px - ${config.icon / 2}px)`,
                  top: `calc(50% + ${y}px - ${config.icon / 2}px)`,
                  width: config.icon,
                  height: config.icon
                }}
              >
                {/* Counter-rotation to keep icons upright, and breathing motions */}
                <motion.div
                  animate={shouldReduceMotion ? { rotate: 0 } : {
                    rotate: -360,
                  }}
                  transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: rotationDuration
                  }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <motion.div
                    animate={shouldReduceMotion ? { opacity: 0.9, scale: 1, y: 0 } : {
                      y: [-2, 2],
                      scale: [0.92, 1.04],
                      opacity: [0.8, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      duration: 2,
                      delay: idx * 0.25
                    }}
                    className="w-full h-full flex items-center justify-center text-primary/80 dark:text-primary/90"
                  >
                    <IconComponent 
                      style={{ width: "100%", height: "100%" }} 
                      strokeWidth={config.strokeWidth}
                    />
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Optional Label */}
      {label && (
        <span className={cn(
          "font-black uppercase tracking-widest text-foreground animate-pulse mt-4",
          size === "sm" && "text-[8px]",
          size === "md" && "text-[9.5px]",
          size === "lg" && "text-[11px]"
        )}>
          {label}
        </span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
        role="alert"
        aria-busy="true"
        aria-live="polite"
      >
        {content}
      </div>
    );
  }

  return content;
}

// --------------------------------------------------
// Variations & Subcomponents
// --------------------------------------------------

export function LoadingScreen({ label = "Loading...", size = "lg" }: { label?: string; size?: "sm" | "md" | "lg" }) {
  return <BrandLoader fullscreen size={size} label={label} />;
}

export function LoadingOverlay({ label, size = "md" }: { label?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div 
      className="absolute inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-[2px] w-full h-full"
      role="status"
      aria-busy="true"
    >
      <BrandLoader size={size} label={label} />
    </div>
  );
}

export function PageLoader({ label = "Syncing application state...", size = "md" }: { label?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex items-center justify-center py-20 w-full min-h-[40vh]">
      <BrandLoader size={size} label={label} />
    </div>
  );
}

export function InlineLoader({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  return <BrandLoader size={size} />;
}
