"use client"

import { motion } from "framer-motion";
import * as React from "react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepProgress({ currentStep, totalSteps, className }: StepProgressProps) {
  const pct = Math.max(0, Math.min(1, (currentStep) / Math.max(1, totalSteps))) * 100;

  return (
    <div className={"relative h-2 w-full overflow-hidden rounded-full bg-muted/50 " + (className || "")}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress ${currentStep} of ${totalSteps}`}
    >
      {/* Base fill */}
      <motion.div
        className="absolute left-0 top-0 h-full rounded-full"
        style={{
          background: "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)",
          boxShadow: "0 0 12px rgba(0, 255, 169, 0.25)",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />

      {/* Shimmer overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ backgroundPositionX: 0 }}
        animate={{ backgroundPositionX: ["0%", "200%"] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        style={{
          backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          backgroundSize: "200% 100%",
          maskImage: `linear-gradient(to right, black ${pct}%, transparent ${pct}%)`,
          WebkitMaskImage: `linear-gradient(to right, black ${pct}%, transparent ${pct}%)`,
        }}
      />

      {/* Floating glow dot at the progress end */}
      <motion.div
        className="absolute -top-1 h-4 w-4 rounded-full"
        style={{
          left: `calc(${pct}% - 8px)`,
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          filter: "blur(1px)",
        }}
        animate={{ scale: [0.8, 1.1, 0.9], opacity: [0.6, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      />
    </div>
  );
}

export default StepProgress;


