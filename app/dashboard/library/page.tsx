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

function MasonryGallery({ ads }: { ads: Ad[] }) {
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const viewportCenterY = window.innerHeight / 2;
        const maxDistance = Math.max(window.innerHeight, 1);

        Object.values(itemRefs.current).forEach((el) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const itemCenterY = rect.top + rect.height / 2;
          const distanceY = Math.abs(itemCenterY - viewportCenterY);
          const distanceRatio = Math.min(distanceY / maxDistance, 1);
          const scale = 1.08 - distanceRatio * 0.18; // 1.08 -> 0.90
          const translateY = (distanceRatio - 0.5) * 10; // subtle parallax
          const elevation = Math.round((scale - 0.9) * 100);

          el.style.transform = `translateY(${translateY}px) scale(${scale.toFixed(3)})`;
          el.style.zIndex = String(10 + elevation);
          el.style.transition = "transform 120ms ease-out";
        });

        tickingRef.current = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll as EventListener);
      window.removeEventListener("resize", handleScroll as EventListener);
    };
  }, []);

  const getAspect = (index: number) => {
    const pattern = index % 6;
    if (pattern === 0) return "4 / 5"; // portrait
    if (pattern === 1) return "1 / 1"; // square
    if (pattern === 2) return "16 / 9"; // landscape
    if (pattern === 3) return "3 / 4"; // portrait
    if (pattern === 4) return "1 / 1"; // square
    return "5 / 4"; // slightly wide
  };

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {ads.map((ad, index) => (
        <div
          key={ad.id}
          ref={(node) => {
            itemRefs.current[ad.id] = node;
          }}
          className="group mb-4 break-inside-avoid relative will-change-transform"
        >
          <Card className="overflow-hidden border border-border/40 rounded-2xl shadow-sm transition-shadow duration-200 group-hover:shadow-xl">
            <div className="relative bg-muted/20" style={{ aspectRatio: getAspect(index) }}>
              {ad.media === "video" ? (
                <video src={ad.previewUrl} className="w-full h-full object-cover" muted playsInline />
              ) : (
                <img src={ad.previewUrl} alt={ad.heading} className="w-full h-full object-cover" />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-full flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {ad.heading}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/20">
                        <BadgeCheckIcon className="w-3 h-3 mr-1" />
                        {ad.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {ad.postType}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 px-3 pointer-events-auto border-primary/40 text-primary hover:bg-primary/10">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="h-8 px-3 pointer-events-auto bg-primary text-primary-foreground hover:bg-primary/90">
                      <Download className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-primary/40 rounded-2xl transition-all duration-200" />
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
        <MasonryGallery ads={ads} />
      )}
    </div>
  );
}
  