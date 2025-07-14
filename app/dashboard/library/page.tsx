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
import { useEffect, useState } from "react";
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
    heading: "Summer Sale!",
    platform: "Instagram",
    postType: "Feed Post (Square)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    media: "image",
    previewUrl: "https://miro.medium.com/v2/resize:fit:1400/0*fHbhjfxuc3wQTzq9",
    heading: "New Product Launch",
    platform: "Facebook",
    postType: "Story",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    media: "image",
    previewUrl: "https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_1.7777777777777777,w_1920,h_1080,g_auto/dpr_auto/f_auto/q_auto:eco/v1/Greek-mythology-gettyImages-1220052224?_a=BAVAZGDX0",
    heading: "Join Our Webinar",
    platform: "LinkedIn",
    postType: "Feed Post (Image)",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

function SkeletonCard() {
  return (
    <Card className="shadow-lg rounded-xl border border-border/40 overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-muted/20">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <Card key={ad.id} className="shadow-lg rounded-xl border border-border/40 overflow-hidden hover:shadow-xl transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9 bg-muted/20">
                {ad.media === "video" ? (
                  <video src={ad.previewUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={ad.previewUrl} alt={ad.heading} className="w-full h-full object-cover" />
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 line-clamp-2">{ad.heading}</h3>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                    <BadgeCheckIcon className="w-3 h-3 mr-1" />
                    {ad.platform}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {ad.postType}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <DateClient iso={ad.createdAt} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 px-3">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="h-8 px-3">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
  