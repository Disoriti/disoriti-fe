"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to dashboard after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your subscription has been activated.
          You will be redirected to the dashboard in a few seconds.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild>
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/account/subscription">View Subscription</a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
