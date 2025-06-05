import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { FeatureCard } from "@/components/ui/feature-card";
import { DashboardWelcome } from "@/components/ui/dashboard-welcome";
import { PlusCircle, Library, Bot, Calendar, Settings } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-8 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>| Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DashboardWelcome name="shadcn" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Posts"
          value="1,234"
          description="Posts created this month"
          trend={{ value: 12, isPositive: true }}
        />
        <AnalyticsCard
          title="Active Campaigns"
          value="12"
          description="Currently running campaigns"
          trend={{ value: 8, isPositive: true }}
        />
        <AnalyticsCard
          title="Engagement Rate"
          value="24.5%"
          description="Average engagement per post"
          trend={{ value: 3.2, isPositive: false }}
        />
        <AnalyticsCard
          title="Total Reach"
          value="45.2K"
          description="Total audience reached"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-6 text-2xl font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Create Post"
            description="Generate and create new social media posts with AI assistance"
            icon={PlusCircle}
            href="/create"
          />
          <FeatureCard
            title="Library"
            description="Manage and edit your existing posts and campaigns"
            icon={Library}
            href="/library"
          />
          <FeatureCard
            title="Disoriti Assistant"
            description="Get AI-powered suggestions and optimize your content"
            icon={Bot}
            href="/assistant"
          />
          <FeatureCard
            title="Planner"
            description="Plan and schedule your posts and campaigns"
            icon={Calendar}
            href="/dashboard/planner"
          />
          <FeatureCard
            title="User Settings"
            description="Manage your account and preferences"
            icon={Settings}
            href="/settings"
          />
        </div>
      </div>
    </div>
  );
}
