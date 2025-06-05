"use client";

import { useState } from "react";

interface DashboardTipProps {
  tip: string;
}

export function DashboardTip({ tip }: DashboardTipProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="mb-6 flex items-center justify-between rounded-lg bg-disoriti-accent/10 px-4 py-3 text-disoriti-accent">
      <span className="font-medium">💡 {tip}</span>
      <button
        className="ml-4 rounded px-2 py-1 text-xs text-disoriti-accent/80 hover:bg-disoriti-accent/20"
        onClick={() => setVisible(false)}
        aria-label="Dismiss tip"
      >
        Dismiss
      </button>
    </div>
  );
} 