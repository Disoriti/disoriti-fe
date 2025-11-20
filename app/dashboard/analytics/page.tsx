"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Image as ImageIcon,
  Sparkles,
  Activity,
  Zap
} from "lucide-react";
import { API_URLS } from "@/lib/api";
import { authenticatedFetch, isUnauthorizedError } from "@/lib/auth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface PlatformData {
  platform: string;
  totalImages: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  engagementRate: number;
  growth: number;
}

interface AnalyticsData {
  totalImages: number;
  totalViews: number;
  totalEngagement: number;
  averageEngagementRate: number;
  platforms: PlatformData[];
  recentActivity: Array<{
    id: string;
    platform: string;
    action: string;
    timestamp: string;
  }>;
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Youtube: Youtube,
};

const platformColors: Record<string, { primary: string; secondary: string }> = {
  Facebook: { primary: "#1877F2", secondary: "#1877F220" },
  Instagram: { primary: "#E4405F", secondary: "#E4405F20" },
  Twitter: { primary: "#1DA1F2", secondary: "#1DA1F220" },
  LinkedIn: { primary: "#0077B5", secondary: "#0077B520" },
  Youtube: { primary: "#FF0000", secondary: "#FF000020" },
};

function AnalyticsPageInner() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(
        `${API_URLS.ANALYTICS_DASHBOARD_URL}?timeRange=${selectedTimeRange}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        // If API doesn't exist yet, use mock data
        if (response.status === 404) {
          setAnalyticsData(getMockData());
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalyticsData(data.data || getMockData());
    } catch (error) {
      console.error("Analytics fetch error:", error);
      if (!isUnauthorizedError(error)) {
        // Use mock data on error
        setAnalyticsData(getMockData());
      }
    } finally {
      setLoading(false);
    }
  };

  const getMockData = (): AnalyticsData => {
    return {
      totalImages: 247,
      totalViews: 125000,
      totalEngagement: 15234,
      averageEngagementRate: 12.2,
      platforms: [
        {
          platform: "Facebook",
          totalImages: 89,
          totalViews: 45000,
          totalLikes: 3200,
          totalShares: 890,
          totalComments: 450,
          engagementRate: 10.1,
          growth: 15.3,
        },
        {
          platform: "Instagram",
          totalImages: 112,
          totalViews: 62000,
          totalLikes: 7800,
          totalShares: 1200,
          totalComments: 980,
          engagementRate: 15.8,
          growth: 22.4,
        },
        {
          platform: "Twitter",
          totalImages: 28,
          totalViews: 12000,
          totalLikes: 2100,
          totalShares: 450,
          totalComments: 320,
          engagementRate: 24.0,
          growth: 8.7,
        },
        {
          platform: "LinkedIn",
          totalImages: 18,
          totalViews: 6000,
          totalLikes: 1134,
          totalShares: 280,
          totalComments: 145,
          engagementRate: 26.0,
          growth: 12.5,
        },
      ],
      recentActivity: [
        { id: "1", platform: "Instagram", action: "New post published", timestamp: new Date().toISOString() },
        { id: "2", platform: "Facebook", action: "Reached 1K views", timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: "3", platform: "Twitter", action: "Viral post detected", timestamp: new Date(Date.now() - 7200000).toISOString() },
      ],
    };
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getMaxValue = (platforms: PlatformData[], key: keyof PlatformData): number => {
    return Math.max(...platforms.map((p) => (typeof p[key] === "number" ? p[key] : 0) as number), 1);
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!analyticsData) return null;

  const maxViews = getMaxValue(analyticsData.platforms, "totalViews");
  const maxImages = getMaxValue(analyticsData.platforms, "totalImages");

  return (
    <div className="space-y-8 p-6 animate-fade-in relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-disoriti-primary/10 to-disoriti-accent/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-disoriti-accent/10 to-disoriti-primary/10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-r from-disoriti-primary/20 to-disoriti-accent/20 border border-disoriti-primary/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 className="h-8 w-8 text-disoriti-primary" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-disoriti-primary/80 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Track your content performance across all platforms</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(["7d", "30d", "90d", "all"] as const).map((range) => (
              <motion.button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTimeRange === range
                    ? "bg-disoriti-primary text-white shadow-lg shadow-disoriti-primary/50"
                    : "bg-background/50 text-muted-foreground hover:bg-background/80"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range === "all" ? "All Time" : range.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AnalyticsCard
            title="Total Images"
            value={analyticsData.totalImages.toLocaleString()}
            description="Across all platforms"
            trend={{ value: 12.5, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnalyticsCard
            title="Total Views"
            value={formatNumber(analyticsData.totalViews)}
            description="Cumulative views"
            trend={{ value: 18.2, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnalyticsCard
            title="Total Engagement"
            value={formatNumber(analyticsData.totalEngagement)}
            description="Likes, shares, comments"
            trend={{ value: 24.8, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnalyticsCard
            title="Avg. Engagement Rate"
            value={`${analyticsData.averageEngagementRate.toFixed(1)}%`}
            description="Across all posts"
            trend={{ value: 3.5, isPositive: true }}
          />
        </motion.div>
      </div>

      {/* Platform Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10"
      >
        <Card className="border-disoriti-primary/20 bg-gradient-to-br from-background/80 to-disoriti-secondary/20 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-lg bg-gradient-to-r from-disoriti-primary/20 to-disoriti-accent/20"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Activity className="h-5 w-5 text-disoriti-primary" />
                </motion.div>
                <CardTitle className="text-2xl">Platform Performance</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {analyticsData.platforms.map((platform, index) => {
              const Icon = platformIcons[platform.platform] || ImageIcon;
              const colors = platformColors[platform.platform] || {
                primary: "#00FFA9",
                secondary: "#00FFA920",
              };

              return (
                <motion.div
                  key={platform.platform}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="group"
                >
                  <div className="p-6 rounded-xl border border-disoriti-primary/10 bg-gradient-to-r from-background/50 to-muted/20 hover:border-disoriti-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-disoriti-primary/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="p-3 rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary})`,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="h-6 w-6" style={{ color: colors.primary }} />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold">{platform.platform}</h3>
                          <p className="text-sm text-muted-foreground">
                            {platform.totalImages} images uploaded
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-disoriti-primary">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-semibold">+{platform.growth.toFixed(1)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Growth rate</p>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Views</p>
                          <p className="text-sm font-semibold">{formatNumber(platform.totalViews)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50">
                        <Heart className="h-4 w-4 text-red-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Likes</p>
                          <p className="text-sm font-semibold">{formatNumber(platform.totalLikes)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50">
                        <Share2 className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Shares</p>
                          <p className="text-sm font-semibold">{formatNumber(platform.totalShares)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50">
                        <MessageCircle className="h-4 w-4 text-green-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Comments</p>
                          <p className="text-sm font-semibold">{formatNumber(platform.totalComments)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Views</span>
                          <span className="text-disoriti-primary">
                            {((platform.totalViews / maxViews) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}80)`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(platform.totalViews / maxViews) * 100}%` }}
                            transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Images Uploaded</span>
                          <span className="text-disoriti-primary">
                            {((platform.totalImages / maxImages) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-disoriti-primary to-disoriti-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${(platform.totalImages / maxImages) * 100}%` }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Engagement Rate</span>
                          <span className="text-disoriti-primary">{platform.engagementRate.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-disoriti-accent to-disoriti-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${platform.engagementRate}%` }}
                            transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Visual Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="border-disoriti-primary/20 bg-gradient-to-br from-background/80 to-disoriti-secondary/20 backdrop-blur-md h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-lg bg-gradient-to-r from-disoriti-primary/20 to-disoriti-accent/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ImageIcon className="h-5 w-5 text-disoriti-primary" />
                </motion.div>
                <CardTitle>Images by Platform</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.platforms.map((platform, index) => {
                  const Icon = platformIcons[platform.platform] || ImageIcon;
                  const colors = platformColors[platform.platform] || {
                    primary: "#00FFA9",
                    secondary: "#00FFA920",
                  };
                  const percentage = (platform.totalImages / analyticsData.totalImages) * 100;

                  return (
                    <motion.div
                      key={platform.platform}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <Icon className="h-5 w-5" style={{ color: colors.primary }} />
                        <span className="text-sm font-medium">{platform.platform}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            {platform.totalImages} images
                          </span>
                          <span className="text-xs font-semibold text-disoriti-primary">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}80)`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card className="border-disoriti-primary/20 bg-gradient-to-br from-background/80 to-disoriti-secondary/20 backdrop-blur-md h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-lg bg-gradient-to-r from-disoriti-primary/20 to-disoriti-accent/20"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-5 w-5 text-disoriti-primary" />
                </motion.div>
                <CardTitle>Top Performers</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.platforms
                  .sort((a, b) => b.engagementRate - a.engagementRate)
                  .slice(0, 3)
                  .map((platform, index) => {
                    const Icon = platformIcons[platform.platform] || ImageIcon;
                    const colors = platformColors[platform.platform] || {
                      primary: "#00FFA9",
                      secondary: "#00FFA920",
                    };

                    return (
                      <motion.div
                        key={platform.platform}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className="p-4 rounded-xl border border-disoriti-primary/10 bg-gradient-to-r from-background/50 to-muted/20 hover:border-disoriti-primary/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{
                                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary})`,
                              }}
                            >
                              <Icon className="h-5 w-5" style={{ color: colors.primary }} />
                            </div>
                            <div>
                              <p className="font-semibold">{platform.platform}</p>
                              <p className="text-xs text-muted-foreground">
                                {platform.totalImages} posts
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-4 w-4 text-disoriti-primary" />
                              <span className="text-lg font-bold text-disoriti-primary">
                                {platform.engagementRate.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Engagement</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      }
    >
      <AnalyticsPageInner />
    </Suspense>
  );
}

