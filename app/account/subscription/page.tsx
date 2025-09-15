"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { SubscriptionStatus } from "@/components/ui/subscription-status";
import { Button } from "@/components/ui/button";
import { API_URLS } from "@/lib/api";
import { authenticatedFetch } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SubscriptionDetails {
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  credits_used: number;
  credits_limit: number;
  expiry_date: string;
}

export default function SubscriptionPage() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await authenticatedFetch(API_URLS.SUBSCRIPTION_STATUS_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch subscription status');
        }
        const data = await response.json();
        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription details');
        toast.error('Could not load subscription details');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSubscription();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No subscription found</p>
        <Button asChild>
          <a href="/pricing">View Plans</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Subscription</h1>
        
        <SubscriptionStatus
          plan={subscription.plan}
          status={subscription.status}
          creditsUsed={subscription.credits_used}
          creditsLimit={subscription.credits_limit}
          expiryDate={subscription.expiry_date}
          className="mb-8"
        />

        <div className="flex flex-col gap-4">
          <Button asChild variant="outline">
            <a href="/pricing">
              Change Plan
            </a>
          </Button>
          
          {subscription.status === 'active' && (
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive"
              onClick={() => toast.error('Contact support to cancel your subscription')}
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
