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
import { Folder, Download, BadgeCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton";
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

// Mock data
const mockAds: Ad[] = [
  {
    id: "1",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    heading: "Summer Sale!",
    platform: "Instagram",
    postType: "Feed Post (Square)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    heading: "New Product Launch",
    platform: "Facebook",
    postType: "Story",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    media: "image",
    previewUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    heading: "Join Our Webinar",
    platform: "LinkedIn",
    postType: "Feed Post (Image)",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

function SkeletonCard() {
  return (
    <div className="bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 rounded-2xl shadow-lg p-4 flex flex-col">
      <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden bg-black/10">
        <Skeleton className="w-full h-full" />
      </div>
      <Skeleton className="h-5 w-2/3 mb-2 rounded" />
      <Skeleton className="h-4 w-1/2 mb-2 rounded" />
      <div className="flex justify-between items-center mt-auto">
        <Skeleton className="h-4 w-16 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </div>
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
            <BreadcrumbLink href="/dashboard">| Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Library</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl md:text-3xl font-bold text-disoriti-primary mb-8 tracking-tight animate-glow">Your Ad Library</h1>
      
      {generatingImage && <AdGenerationLoader />}
      
      {generatedImage && (
        <div className="mb-8 p-6 bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Generated Ad</h2>
          <div className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden mb-4">
            <img src={generatedImage} alt="Generated Ad" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={handleDownloadImage}
            className="flex items-center gap-2 px-4 py-2 bg-disoriti-primary text-white rounded-lg hover:bg-disoriti-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Image
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-[400px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-disoriti-primary/70">
          <Folder className="h-16 w-16 mb-4 text-disoriti-primary/40" />
          <p className="text-xl font-semibold mb-2">No ads yet!</p>
          <p className="text-base">Start creating to see your magic here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 rounded-2xl shadow-lg p-4 flex flex-col">
              <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden bg-black/10">
                {ad.media === "video" ? (
                  <video src={ad.previewUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={ad.previewUrl} alt={ad.heading} className="w-full h-full object-cover" />
                )}
              </div>
              <h2 className="text-xl font-bold mb-2">{ad.heading}</h2>
              <div className="flex items-center gap-2 text-sm text-disoriti-primary/70 mb-2">
              <Badge
                variant="secondary"
                className="bg-blue-500 text-white dark:bg-blue-600"
              >
                <BadgeCheckIcon />
                {ad.platform}
              </Badge>
                <Badge variant="outline">{ad.postType}</Badge>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs text-disoriti-primary/50">{new Date(ad.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button className="text-xs px-4 py-2 rounded bg-disoriti-primary hover:bg-disoriti-primary border border-disoriti-primary/30">View</button>
                  <button className="text-xs px-4 py-2 rounded bg-disoriti-accent hover:bg-disoriti-accent border border-disoriti-accent/30">Download</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  