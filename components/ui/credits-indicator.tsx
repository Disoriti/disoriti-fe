"use client"

import { useAuth } from "@/contexts/auth-context"

export default function CreditsIndicator() {
  const { monthlyCreditsLimit, monthlyCreditsUsed, monthlyCreditsResetAt } = useAuth();

  const used = typeof monthlyCreditsUsed === 'number' ? monthlyCreditsUsed : 0;
  const limit = typeof monthlyCreditsLimit === 'number' ? monthlyCreditsLimit : 0;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const warn = pct >= 80 && pct < 100;
  const exhausted = limit > 0 && used >= limit;

  return (
    <div className="hidden sm:flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
      <div className="flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${exhausted ? 'bg-red-500' : warn ? 'bg-amber-500' : 'bg-primary'} animate-pulse`} />
        <span className="font-medium">Credits</span>
      </div>
      
      <div className="font-mono">
        {used} / {limit}
      </div>
      {monthlyCreditsResetAt && (
        <div className="text-muted-foreground">Resets {new Date(monthlyCreditsResetAt).toLocaleDateString()}</div>
      )}
    </div>
  );
}


