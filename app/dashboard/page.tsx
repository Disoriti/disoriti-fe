"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { FeatureCard } from "@/components/ui/feature-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { authenticatedFetch } from "@/lib/auth";
import { API_URLS } from "@/lib/api";
import { 
  PlusCircle, 
  Library, 
  Bot, 
  Calendar, 
  Settings,
  Image as ImageIcon,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  BarChart3,
  FileImage
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface LibraryImage {
  id: string;
  url?: string | null;
  public_url?: string | null;
  signed_url?: string | null;
  created_at?: string;
  source?: string;
  metadata?: {
    custom_prompt?: string;
  };
}

interface DashboardStats {
  totalImages: number;
  totalPosts: number;
  creditsUsed: number;
  creditsRemaining: number;
  recentImages: LibraryImage[];
}

export default function DashboardPage() {
  const { user, monthlyCreditsLimit, monthlyCreditsUsed, plan } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Check cache first
      const cacheKey = 'dashboard_recent_images';
      const cacheTimestampKey = 'dashboard_recent_images_timestamp';
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes
      
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
      
      // Use cache if it exists and is not expired
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();
        
        if (now - timestamp < cacheExpiry) {
          try {
            const cachedImages: LibraryImage[] = JSON.parse(cachedData);
            const totalImages = cachedImages.length;
            const recentImages = [...cachedImages]
              .filter(img => img.id && (img.public_url || img.url || img.signed_url))
              .sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA;
              })
              .slice(0, 6);
            
            setStats({
              totalImages,
              totalPosts: totalImages,
              creditsUsed: monthlyCreditsUsed || 0,
              creditsRemaining: Math.max(0, (monthlyCreditsLimit || 0) - (monthlyCreditsUsed || 0)),
              recentImages,
            });
            setLoading(false);
            return;
          } catch (e) {
            // If cache is corrupted, clear it and fetch fresh data
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheTimestampKey);
          }
        }
      }
      
      // Fetch library images
      const libraryResponse = await authenticatedFetch(`${API_URLS.LIBRARY_URL}?limit=6&skip=0`, {
        method: 'GET',
      });

      let images: LibraryImage[] = [];
      if (libraryResponse.ok) {
        const libraryData = await libraryResponse.json();
        images = Array.isArray(libraryData.data?.images) 
          ? libraryData.data.images 
          : Array.isArray(libraryData.data) 
          ? libraryData.data 
          : [];
        
        // Cache the images
        localStorage.setItem(cacheKey, JSON.stringify(images));
        localStorage.setItem(cacheTimestampKey, Date.now().toString());
      }

      // Calculate stats
      const totalImages = images.length;
      // Sort by created_at descending (most recent first) and take first 6
      const recentImages = [...images]
        .filter(img => img.id && (img.public_url || img.url || img.signed_url))
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 6);
      
      const creditsUsed = monthlyCreditsUsed || 0;
      const creditsLimit = monthlyCreditsLimit || 0;
      const creditsRemaining = Math.max(0, creditsLimit - creditsUsed);

      setStats({
        totalImages,
        totalPosts: totalImages, // Assuming each image is a post
        creditsUsed,
        creditsRemaining,
        recentImages,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getCreditsPercentage = () => {
    if (!monthlyCreditsLimit || monthlyCreditsLimit === 0) return 0;
    return Math.min(100, (monthlyCreditsUsed || 0) / monthlyCreditsLimit * 100);
  };

  const handleImageLoad = (key: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* Futuristic background orbs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-accent/20 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute inset-0 border border-primary/5 rounded-3xl mx-4 my-6" />

      <div className="relative z-10 space-y-8 p-6 animate-fade-in">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-primary/25 bg-background/60 p-6 backdrop-blur-lg shadow-[0_0_40px_rgba(59,130,246,0.12)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-primary/40 before:opacity-60"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
                </h1>
                <p className="mt-2 text-muted-foreground text-sm md:text-base">
                  {plan ? `You're on the ${plan} plan` : "Ready to create something amazing today?"}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.08, rotate: 4 }}
                className="hidden md:block"
              >
                <div className="rounded-2xl border border-primary/30 bg-background/70 p-4 shadow-[0_0_30px_rgba(59,130,246,0.25)]">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </>
        ) : (
          <>
            <AnalyticsCard
              title="Total Images"
              value={stats?.totalImages?.toLocaleString() || "0"}
              description="Images in your library"
              trend={{ value: 0, isPositive: true }}
            />
            <AnalyticsCard
              title="Credits Used"
              value={`${stats?.creditsUsed || 0}/${(stats?.creditsUsed || 0) + (stats?.creditsRemaining || 0)}`}
              description={`${stats?.creditsRemaining || 0} credits remaining`}
              trend={{ 
                value: monthlyCreditsLimit ? Math.round((monthlyCreditsUsed || 0) / monthlyCreditsLimit * 100) : 0, 
                isPositive: getCreditsPercentage() < 80 
              }}
            />
            <AnalyticsCard
              title="Current Plan"
              value={plan || "Free"}
              description="Your subscription tier"
              trend={{ value: 0, isPositive: true }}
            />
            <AnalyticsCard
              title="This Month"
              value={stats?.totalPosts || 0}
              description="Posts created"
              trend={{ value: 0, isPositive: true }}
            />
          </>
        )}
        </div>

        {/* Credits Usage Bar */}
        {monthlyCreditsLimit && monthlyCreditsLimit > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-primary/25 bg-background/60 backdrop-blur-md shadow-[0_0_32px_rgba(15,23,42,0.55)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  Monthly Credits Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {monthlyCreditsUsed || 0} of {monthlyCreditsLimit} credits used
                    </span>
                    <span className={`font-semibold ${
                      getCreditsPercentage() > 80 ? "text-red-400" : 
                      getCreditsPercentage() > 50 ? "text-yellow-400" : 
                      "text-green-400"
                    }`}>
                      {Math.round(getCreditsPercentage())}%
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getCreditsPercentage()}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        getCreditsPercentage() > 80 ? "bg-red-500" : 
                        getCreditsPercentage() > 50 ? "bg-yellow-500" : 
                        "bg-primary"
                      }`}
                    />
                  </div>
                  {getCreditsPercentage() > 80 && (
                    <p className="text-xs text-muted-foreground">
                      You're running low on credits. Consider upgrading your plan.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-primary/25 bg-background/60 backdrop-blur-md h-full shadow-[0_0_32px_rgba(15,23,42,0.55)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-primary" />
                  Recent Images
                </CardTitle>
                <Link 
                  href="/dashboard/library" 
                  className="text-sm text-primary hover:text-accent transition-colors"
                >
                  View all →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                  ))}
                </div>
              ) : stats?.recentImages && stats.recentImages.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {stats.recentImages.map((image, index) => {
                    const imageUrl = image.public_url || image.url || image.signed_url || "";
                    const key = String(image.id || index);
                    const isLoaded = loadedImages[key];

                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-primary/15 bg-background/40 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                      >
                        {!isLoaded && (
                          <div className="absolute inset-0 bg-muted/20 animate-pulse" />
                        )}
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={image.metadata?.custom_prompt || "Generated image"}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            onLoad={() => handleImageLoad(key)}
                          />
                        ) : (
                          <div className="h-full w-full bg-muted/20 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-xs text-white truncate">
                              {formatDate(image.created_at)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted/20 p-4 mb-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">No images yet</p>
                  <Link href="/dashboard/create">
                    <button className="text-sm text-primary hover:text-accent transition-colors">
                      Create your first image →
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-primary/25 bg-background/60 backdrop-blur-md h-full shadow-[0_0_32px_rgba(15,23,42,0.55)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/create">
                <div className="group flex items-center gap-3 rounded-xl border border-primary/15 bg-background/40 p-4 hover:border-primary/40 hover:bg-background/70 hover:shadow-[0_0_28px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <PlusCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Create Post</p>
                    <p className="text-xs text-muted-foreground">Generate new content</p>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/library">
                <div className="group flex items-center gap-3 rounded-xl border border-primary/15 bg-background/40 p-4 hover:border-primary/40 hover:bg-background/70 hover:shadow-[0_0_28px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <Library className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Library</p>
                    <p className="text-xs text-muted-foreground">View all images</p>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/chat">
                <div className="group flex items-center gap-3 rounded-xl border border-primary/15 bg-background/40 p-4 hover:border-primary/40 hover:bg-background/70 hover:shadow-[0_0_28px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">AI Assistant</p>
                    <p className="text-xs text-muted-foreground">Get help & suggestions</p>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/analytics">
                <div className="group flex items-center gap-3 rounded-xl border border-primary/15 bg-background/40 p-4 hover:border-primary/40 hover:bg-background/70 hover:shadow-[0_0_28px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Analytics</p>
                    <p className="text-xs text-muted-foreground">View performance</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-6 text-2xl font-semibold text-foreground">All Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Create Post"
              description="Generate and create new social media posts with AI assistance"
              icon={PlusCircle}
              href="/dashboard/create"
            />
            <FeatureCard
              title="Library"
              description="Manage and edit your existing posts and campaigns"
              icon={Library}
              href="/dashboard/library"
            />
            <FeatureCard
              title="Disoriti Assistant"
              description="Get AI-powered suggestions and optimize your content"
              icon={Bot}
              href="/dashboard/chat"
            />
            <FeatureCard
              title="Scheduler"
              description="Plan and schedule your posts and campaigns"
              icon={Calendar}
              href="/dashboard/scheduler"
            />
            <FeatureCard
              title="Analytics"
              description="Track performance and engagement metrics"
              icon={BarChart3}
              href="/dashboard/analytics"
            />
            <FeatureCard
              title="Settings"
              description="Manage your account and preferences"
              icon={Settings}
              href="/dashboard/settings"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
