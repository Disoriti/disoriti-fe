"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { Folder, Download, Eye, BadgeCheckIcon, Calendar, FileImage } from "lucide-react";
import AdGenerationLoader from "@/components/ad-generation-loader";

// Example ad type
interface Ad {
  id: string;
  media: "image" | "video";
  previewUrl: string;
  heading: string;
  platform: string;
  postType: string;
  createdAt: string;
}

function DateClient({ iso, options }: { iso: string; options?: Intl.DateTimeFormatOptions }) {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Date(iso).toLocaleDateString("en-US", options));
  }, [iso, options]);
  return <span>{date}</span>;
}

// Mock data
const mockAds: Ad[] = [
  {
    id: "1",
    media: "image",
    previewUrl: "https://burst.shopifycdn.com/photos/core-strength-fitness.jpg?width=1000&format=pjpg&exif=0&iptc=0",
    heading: "Summer Fitness Challenge",
    platform: "Instagram",
    postType: "Feed Post (Square)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    heading: "Limited Edition Sneakers",
    platform: "Facebook",
    postType: "Story",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    heading: "Digital Marketing Workshop",
    platform: "LinkedIn",
    postType: "Feed Post (Image)",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "4",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    heading: "Healthy Menu Launch",
    platform: "Instagram",
    postType: "Carousel",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "5",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    heading: "Tech Innovation Summit",
    platform: "LinkedIn",
    postType: "Event Post",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "6",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    heading: "Eco-Friendly Collection",
    platform: "Facebook",
    postType: "Feed Post (Image)",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "7",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    heading: "Smart Watch Sale",
    platform: "Instagram",
    postType: "Story",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "8",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
    heading: "Remote Work Solutions",
    platform: "LinkedIn",
    postType: "Feed Post (Square)",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "9",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    heading: "Music Festival Tickets",
    platform: "Facebook",
    postType: "Event Post",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "10",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    heading: "Premium Headphones",
    platform: "Instagram",
    postType: "Product Post",
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    id: "11",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    heading: "Business Analytics Course",
    platform: "LinkedIn",
    postType: "Feed Post (Image)",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "12",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
    heading: "Coffee Shop Opening",
    platform: "Facebook",
    postType: "Story",
    createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
  }
];

function SkeletonCard() {
  return (
    <Card className="shadow-lg rounded-xl border border-border/40 overflow-hidden">
      <div className="bg-muted/20" style={{ aspectRatio: "4 / 5" }}>
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-3 rounded" />
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AdGallery({ ads }: { ads: Ad[] }) {
  const getAspectRatio = (index: number) => {
    const pattern = index % 3;
    switch (pattern) {
      case 0: return "4/3";  // landscape
      case 1: return "1/1";  // square
      case 2: return "3/4";  // portrait
      default: return "4/3"; // default to landscape
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {ads.map((ad, index) => (
        <div key={ad.id} className="group relative">
          <Card className="overflow-hidden border border-border/40 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-lg hover:border-primary/40">
            <div 
              className="relative bg-muted/20" 
              style={{ aspectRatio: getAspectRatio(index) }}
            >
              {ad.media === "video" ? (
                <video 
                  src={ad.previewUrl} 
                  className="w-full h-full object-cover" 
                  muted 
                  playsInline 
                />
              ) : (
                <img 
                  src={ad.previewUrl} 
                  alt={ad.heading} 
                  className="w-full h-full object-cover" 
                />
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="w-full space-y-3">
                  {/* Title and Tags */}
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white truncate mb-2">
                      {ad.heading}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        <BadgeCheckIcon className="w-3 h-3 mr-1" />
                        {ad.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-white/20 text-white">
                        {ad.postType}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 px-3 pointer-events-auto border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-8 px-3 pointer-events-auto bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default function LibraryPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading and set mock ads
    setTimeout(() => {
      setAds(mockAds); // Use mock ads for now
      setLoading(false);
    }, 1000);
  }, []);

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    // Simulate API call to generate image
    setTimeout(() => {
      // Replace with actual API response
      setGeneratedImage("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80");
      setGeneratingImage(false);
    }, 3000);
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated-ad.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Library</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Ad Library</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your created advertisements</p>
        </div>
        <Button onClick={handleGenerateImage} disabled={generatingImage}>
          <FileImage className="w-4 h-4 mr-2" />
          Generate New Ad
        </Button>
      </div>
      
      {generatingImage && <AdGenerationLoader />}
      
      {generatedImage && (
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="w-5 h-5" />
              Generated Ad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-muted/20">
              <img src={generatedImage} alt="Generated Ad" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleDownloadImage} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Image
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Full Size
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : ads.length === 0 ? (
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Folder className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No ads yet!</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Start creating amazing advertisements to see them appear in your library.
            </p>
            <Button onClick={handleGenerateImage} disabled={generatingImage}>
              <FileImage className="w-4 h-4 mr-2" />
              Create Your First Ad
            </Button>
          </CardContent>
        </Card>
      ) : (
        <AdGallery ads={ads} />
      )}
    </div>
  );
}
  