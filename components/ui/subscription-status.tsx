"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionBadge, type SubscriptionStatus } from "@/components/ui/subscription-badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, CreditCard } from "lucide-react";

interface SubscriptionStatusProps {
  plan: string;
  status: SubscriptionStatus;
  creditsUsed: number;
  creditsLimit: number;
  expiryDate: string;
  className?: string;
}

export function SubscriptionStatus({
  plan,
  status,
  creditsUsed,
  creditsLimit,
  expiryDate,
  className
}: SubscriptionStatusProps) {
  const creditsPercentage = (creditsUsed / creditsLimit) * 100;
  const formattedExpiryDate = new Date(expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{plan}</CardTitle>
          <SubscriptionBadge status={status} />
        </div>
        <CardDescription>
          Your current subscription plan and usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Credits Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Credits Used</span>
              <span className="font-medium">{creditsUsed} / {creditsLimit}</span>
            </div>
            <Progress value={creditsPercentage} className="h-2" />
          </div>

          {/* Subscription Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Renews on</span>
              <span className="font-medium">{formattedExpiryDate}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Billing</span>
              <span className="font-medium">Monthly</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
