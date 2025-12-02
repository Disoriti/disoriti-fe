"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Sparkles } from "lucide-react";

export default function SchedulerPage() {
  return (
    <div className="space-y-6 p-6 relative">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Scheduler</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Blurred Content with Coming Soon Overlay */}
      <div className="relative">
        {/* Blurred Background Content */}
        <div className="blur-md pointer-events-none opacity-30">
          <Card className="h-[600px]">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-4xl font-bold">Scheduler</h1>
                    <p className="text-muted-foreground">Schedule and manage your posts</p>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Card key={i} className="h-16" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30 mb-4">
              <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Coming Soon!
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              We're building an amazing scheduling feature. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
