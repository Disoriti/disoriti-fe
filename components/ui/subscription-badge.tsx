"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

interface SubscriptionBadgeProps {
  status: SubscriptionStatus;
  className?: string;
}

const statusConfig = {
  active: {
    text: 'Active',
    className: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20',
  },
  cancelled: {
    text: 'Cancelled',
    className: 'bg-red-500/10 text-red-500 dark:bg-red-500/20',
  },
  expired: {
    text: 'Expired',
    className: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20',
  },
  trial: {
    text: 'Trial',
    className: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
  },
};

export function SubscriptionBadge({ status, className }: SubscriptionBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="secondary"
      className={cn(
        "font-medium",
        config.className,
        className
      )}
    >
      {config.text}
    </Badge>
  );
}
