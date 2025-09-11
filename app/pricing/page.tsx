"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyLink: string;
  yearlyLink: string;
  features: string[];
  popular?: boolean;
  planId: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Essential",
    description: "Perfect for individuals and small teams getting started",
    monthlyPrice: 19.99,
    yearlyPrice: 14.99,
    monthlyLink: "https://buy.stripe.com/28E4gz89Y3oX2Hlde80Ny02",
    yearlyLink: "https://buy.stripe.com/5kQbJ1cqe0cLeq3a1W0Ny03",
    features: [
      "Up to 50 AI-generated ads per month",
      "Basic templates and layouts",
      "Standard support",
      "Export in common formats",
      "Basic analytics",
    ],
    planId: "essential",
  },
  {
    name: "Premium",
    description: "Advanced features for growing businesses and agencies",
    monthlyPrice: 39.99,
    yearlyPrice: 29.99,
    monthlyLink: "https://buy.stripe.com/5kQcN5ai66B92Hl0rm0Ny00",
    yearlyLink: "https://buy.stripe.com/cNi5kDai61gPeq30rm0Ny01",
    features: [
      "Unlimited AI-generated ads",
      "Premium templates and layouts",
      "Priority support",
      "Advanced export options",
      "Detailed analytics and insights",
      "Custom branding",
      "Team collaboration features",
      "API access",
    ],
    popular: true,
    planId: "premium",
  },
];

export default function PricingPage() {
  const { plan, isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const getCurrentPlanId = () => {
    if (!plan) return null;
    return plan.toLowerCase();
  };

  const isCurrentPlan = (planId: string) => {
    return getCurrentPlanId() === planId;
  };

  const getSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const yearlyTotal = yearlyPrice * 12;
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - yearlyTotal;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, percentage };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Select the perfect plan for your advertising needs
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
                Save up to 25%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((planData) => {
            const currentPrice = billingCycle === 'monthly' ? planData.monthlyPrice : planData.yearlyPrice;
            const currentLink = billingCycle === 'monthly' ? planData.monthlyLink : planData.yearlyLink;
            const savings = getSavings(planData.monthlyPrice, planData.yearlyPrice);
            const isCurrent = isCurrentPlan(planData.planId);

            return (
              <Card 
                key={planData.name} 
                className={`relative ${
                  planData.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-border'
                } ${
                  isCurrent 
                    ? 'ring-2 ring-accent bg-accent/5' 
                    : ''
                }`}
              >
                {planData.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-accent text-accent-foreground px-3 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{planData.name}</CardTitle>
                  <CardDescription className="text-base">
                    {planData.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center pb-6">
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">
                      ${currentPrice}
                    </span>
                    <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                  </div>
                  
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-muted-foreground mb-4">
                      <span className="line-through">${planData.monthlyPrice}/month</span>
                      <span className="ml-2 text-accent font-medium">
                        Save ${savings.savings} ({savings.percentage}%)
                      </span>
                    </div>
                  )}

                  <ul className="space-y-3 text-left">
                    {planData.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button 
                    asChild 
                    className={`w-full ${
                      planData.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    disabled={isCurrent}
                  >
                    <a 
                      href={currentLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      {isCurrent ? 'Current Plan' : `Get ${planData.name}`}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
          <p className="text-sm text-muted-foreground">
            Need help choosing? <a href="#" className="text-primary hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
