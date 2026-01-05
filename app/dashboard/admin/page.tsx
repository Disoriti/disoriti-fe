"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Users,
  TrendingUp,
  DollarSign,
  Shield,
  Search,
  Calendar,
  Activity,
  Globe,
  Eye,
  UserCheck,
  UserX,
  Loader2
} from "lucide-react";
import { API_URLS } from "@/lib/api";
import { authenticatedFetch } from "@/lib/auth";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  plan: "Free" | "Essential" | "Premium";
  status: "active" | "inactive" | "suspended";
  joinedDate: string;
  totalSpent: number;
  adsGenerated: number;
  lastActive?: string;
}

interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TrafficData {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  period?: {
    start: string;
    end: string;
  };
}

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "paid" | "free">("all");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, authLoading, router]);

  // Fetch users
  const fetchUsers = async (pageNum: number = 1, filter?: string, search?: string) => {
    if (!isAdmin) return;
    
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "100", // Fetch more users at once
      });
      
      if (filter && filter !== "all") {
        // Note: Backend may need to support this filter
        // For now, we'll filter on frontend
      }

      const response = await authenticatedFetch(`${API_URLS.ADMIN_USERS_URL}?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setTotalUsers(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
      setError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch traffic
  const fetchTraffic = async () => {
    if (!isAdmin) return;
    
    try {
      const response = await authenticatedFetch(API_URLS.ADMIN_TRAFFIC_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch traffic data');
      }
      const data: TrafficData = await response.json();
      setTraffic(data);
    } catch (err) {
      console.error('Error fetching traffic:', err);
      toast.error('Failed to load traffic data');
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (isAdmin && !authLoading) {
      setLoading(true);
      Promise.all([fetchUsers(1), fetchTraffic()])
        .finally(() => setLoading(false));
    }
  }, [isAdmin, authLoading]);

  // Filter users on frontend (since backend may not support filter param yet)
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "paid" && user.plan !== "Free") ||
      (selectedFilter === "free" && user.plan === "Free");
    return matchesSearch && matchesFilter;
  });

  const paidUsers = users.filter((u) => u.plan !== "Free");
  const freeUsers = users.filter((u) => u.plan === "Free");
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);
  const activeUsers = users.filter((u) => u.status === "active").length;

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Admin</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Badge className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>
          <p className="text-muted-foreground">Manage users, monitor traffic, and oversee platform operations</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {paidUsers.length} paid, {freeUsers.length} free
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time revenue</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Traffic</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {traffic ? traffic.totalVisits.toLocaleString() : "0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {traffic ? traffic.uniqueVisitors.toLocaleString() : "0"} unique visitors
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle>User Management</CardTitle>
            </div>
            <CardDescription>View and manage all platform users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-1">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === "paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("paid")}
                >
                  Paid
                </Button>
                <Button
                  variant={selectedFilter === "free" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("free")}
                >
                  Free
                </Button>
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {user.status === "active" ? (
                        <UserCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <UserX className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{user.email}</p>
                        <Badge
                          variant={user.plan === "Premium" ? "default" : user.plan === "Essential" ? "secondary" : "outline"}
                        >
                          {user.plan}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {user.adsGenerated} ads
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    {user.totalSpent > 0 && (
                      <div className="text-sm font-semibold text-primary">
                        ${user.totalSpent.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Website Traffic */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <CardTitle>Website Traffic</CardTitle>
            </div>
            <CardDescription>Monitor website analytics and visitor metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {traffic ? (
              <>
                {/* Traffic Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Visits</span>
                    </div>
                    <div className="text-2xl font-bold">{traffic.totalVisits.toLocaleString()}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Unique Visitors</span>
                    </div>
                    <div className="text-2xl font-bold">{traffic.uniqueVisitors.toLocaleString()}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Page Views</span>
                    </div>
                    <div className="text-2xl font-bold">{traffic.pageViews.toLocaleString()}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Avg. Duration</span>
                    </div>
                    <div className="text-2xl font-bold">{traffic.avgSessionDuration}</div>
                  </div>
                </div>

                {/* Bounce Rate */}
                <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Bounce Rate</span>
                    <span className="text-sm text-muted-foreground">{traffic.bounceRate}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ 
                        width: traffic.bounceRate.includes('%') 
                          ? traffic.bounceRate 
                          : `${parseFloat(traffic.bounceRate) || 0}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Top Pages */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Top Pages</h3>
                  <div className="space-y-2">
                    {traffic.topPages.map((page, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg border border-border/40 bg-background/50"
                      >
                        <span className="text-sm font-mono">{page.path}</span>
                        <Badge variant="outline">{page.views.toLocaleString()} views</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No traffic data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

