"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { Calendar, Plus, Clock, Instagram, Facebook, Music2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function TimeClient({ iso }: { iso: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    setTime(new Date(iso).toLocaleTimeString());
  }, [iso]);
  return <span>{time}</span>;
}

function DateClient({ iso, options }: { iso: string; options?: Intl.DateTimeFormatOptions }) {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Date(iso).toLocaleDateString("en-US", options));
  }, [iso, options]);
  return <span>{date}</span>;
}

interface ScheduledPost {
  id: string;
  title: string;
  platform: "instagram" | "facebook" | "tiktok";
  scheduledDate: string; // ISO string
  status: "scheduled" | "published" | "draft";
  image?: string;
}

export default function SchedulerPage() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: "1",
      title: "Summer Collection Launch",
      platform: "instagram",
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      status: "scheduled",
    },
    {
      id: "2",
      title: "Product Showcase",
      platform: "facebook",
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      status: "scheduled",
    },
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "facebook":
        return <Facebook className="h-4 w-4 text-blue-500" />;
      case "tiktok":
        return <Music2 className="h-4 w-4 text-black dark:text-white" />;
      default:
        return <Instagram className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "published":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(new Date(currentDate));
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 border border-border/50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate).setDate(day);
      const isToday = new Date(date).toDateString() === new Date().toDateString();
      const isSelected = selectedDate && new Date(selectedDate).toDateString() === new Date(date).toDateString();
      const postsForDay = scheduledPosts.filter(post => 
        new Date(post.scheduledDate).toDateString() === new Date(date).toDateString()
      );
      
      days.push(
        <div
          key={day}
          className={`h-12 border border-border/50 p-1 cursor-pointer transition-colors ${
            isToday ? "bg-primary/10 border-primary/30" : ""
          } ${isSelected ? "bg-primary/20 border-primary" : "hover:bg-muted/50"}`}
          onClick={() => setSelectedDate(new Date(date).toISOString())}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs ${isToday ? "font-bold text-primary" : ""}`}>
              {day}
            </span>
            {postsForDay.length > 0 && (
              <div className="flex gap-1">
                {postsForDay.slice(0, 2).map((post, index) => (
                  <div
                    key={post.id}
                    className={`w-2 h-2 rounded-full ${getStatusColor(post.status)}`}
                    title={post.title}
                  />
                ))}
                {postsForDay.length > 2 && (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 text-[6px] flex items-center justify-center">
                    +
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const getPostsForSelectedDate = () => {
    if (!selectedDate) return [];
    return scheduledPosts.filter(post => 
      new Date(post.scheduledDate).toDateString() === new Date(selectedDate).toDateString()
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb Navigation */}
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-accent/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scheduler</h1>
            <p className="text-muted-foreground">Schedule and manage your posts</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(new Date(new Date(currentDate).getFullYear(), new Date(currentDate).getMonth() - 1).toISOString())}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[120px] text-center">
                    {getMonthName(new Date(currentDate))}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(new Date(new Date(currentDate).getFullYear(), new Date(currentDate).getMonth() + 1).toISOString())}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {/* Calendar days */}
                {renderCalendar()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Date Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Date</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium"><DateClient iso={selectedDate} options={{ 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }} /></p>
                    <p className="text-muted-foreground">
                      {getPostsForSelectedDate().length} scheduled posts
                    </p>
                  </div>
                  
                  {/* Posts for selected date */}
                  <div className="space-y-2">
                    {getPostsForSelectedDate().map(post => (
                      <div key={post.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        {getPlatformIcon(post.platform)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{post.title}</p>
                          <p className="text-xs text-muted-foreground">
                            <TimeClient iso={post.scheduledDate} />
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(post.status)}`}
                        >
                          {post.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a date to view scheduled posts</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Scheduled</span>
                <Badge variant="secondary" className="bg-blue-500">
                  {scheduledPosts.filter(p => p.status === "scheduled").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Published</span>
                <Badge variant="secondary" className="bg-green-500">
                  {scheduledPosts.filter(p => p.status === "published").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Drafts</span>
                <Badge variant="secondary" className="bg-yellow-500">
                  {scheduledPosts.filter(p => p.status === "draft").length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 