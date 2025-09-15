"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-8">
          Your payment was cancelled. No charges were made.
          You can try again or choose a different plan.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild>
            <a href="/pricing">Return to Pricing</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
