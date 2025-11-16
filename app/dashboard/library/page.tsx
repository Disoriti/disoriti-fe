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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Folder,
  Download,
  BadgeCheckIcon,
  Calendar,
  FileImage,
  Search,
} from "lucide-react";
import AdGenerationLoader from "@/components/ad-generation-loader";
import { API_URLS } from "@/lib/api";
import { authenticatedFetch } from "@/lib/auth";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface LibraryImagePayload {
  id?: string;
  source?: string;
  url?: string | null;
  public_url?: string | null;
  signed_url?: string | null;
  blob_path?: string | null;
  bucket?: string | null;
  metadata?: {
    index?: number;
    custom_prompt?: string;
    reference_image?: {
      filename?: string;
      content_type?: string;
      size?: number;
    };
  };
  created_at?: string;
}

const formatSource = (source?: string): string => {
  if (!source) return "Generated";
  const readable = source.replace(/[_-]+/g, " ");
  return readable.charAt(0).toUpperCase() + readable.slice(1);
};

const formatFilename = (filename?: string): string => {
  if (!filename) return "Generated Image";
  const parts = filename.split("/");
  return parts[parts.length - 1] || filename;
};

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
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { mode: "cors", cache: "no-store" });
      if (!response.ok) throw new Error(`Download failed (${response.status})`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      // Fallback: try opening in new tab if download attribute is blocked by CORS
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
  const getAspectRatio = (index: number) => {
    // Seeded variability so layout feels organic but stable per render
    const seed = (index * 9301 + 49297) % 233280; // deterministic pseudo-random
    const r = seed / 233280;
    if (r < 0.33) return "4/3";     // landscape
    if (r < 0.66) return "1/1";     // square
    return "3/4";                   // portrait
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {ads.map((ad, index) => {
        const tiltClasses = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-[1.5deg]", "-rotate-[1.5deg]"];
        const tiltClass = tiltClasses[(index * 7) % tiltClasses.length];
        // Randomly allow items to span 2 columns on large screens for variety
        const seed = (index * 1103515245 + 12345) & 0x7fffffff;
        const spanLarge = seed % 7 === 0; // ~14% chance
        return (
          <div key={ad.id} className={`group relative ${spanLarge ? 'lg:col-span-2' : ''}`}>
            <Card className={`overflow-hidden border border-primary/10 rounded-2xl shadow-sm transition-all duration-500 hover:shadow-glow-lg hover:border-primary/30 bg-background/40 backdrop-blur-sm transform-gpu ${tiltClass} group-hover:rotate-0 group-hover:scale-[1.02]`}>
              <div 
                className="relative bg-muted/20" 
                style={{ aspectRatio: getAspectRatio(index) }}
              >
                <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-xl opacity-60 group-hover:opacity-90 transition-opacity -z-10" />
                <div className="pointer-events-none absolute -inset-px rounded-2xl border border-primary/10" />
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
                    className="w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-[1.06]" 
                  />
                )}

                {/* Scanlines + sheen */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/90 via-[#050608]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-[0.08] group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundImage: "repeating-linear-gradient( to bottom, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)" }} />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
                        <Badge variant="outline" className="text-xs border-white/20 text-white">
                          <Calendar className="w-3 h-3 mr-1" />
                          <DateClient iso={ad.createdAt} options={{ month: 'short', day: 'numeric' }} />
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="icon"
                              className="h-9 w-9 pointer-events-auto rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg"
                              onClick={() => {
                                const safeHeading = ad.heading?.trim().replace(/\s+/g, "-").toLowerCase() || "image";
                                const filename = `disoriti-${safeHeading || "image"}-${ad.id}.png`;
                                downloadImage(ad.previewUrl, filename);
                              }}
                              aria-label="Download"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="end">
                            <span>Download</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default function LibraryPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<string>("all");
  const [postType, setPostType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadLibrary = useCallback(
    async (abortSignal?: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authenticatedFetch(`${API_URLS.LIBRARY_URL}?limit=50`, {
          method: "GET",
          signal: abortSignal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load library (status ${response.status})`);
        }

        const payload = await response.json();
        const images: LibraryImagePayload[] = Array.isArray(payload?.data?.images) ? payload.data.images : [];

        const mapped = images.reduce<Ad[]>((acc, image, index) => {
          const previewUrl = image.public_url ?? image.url ?? image.signed_url ?? "";
          if (!image.id || !previewUrl) {
            return acc;
          }

          acc.push({
            id: image.id,
            media: "image",
            previewUrl,
            heading: image.metadata?.custom_prompt?.trim() || `Generated Image ${index + 1}`,
            platform: formatSource(image.source),
            postType: formatFilename(image.metadata?.reference_image?.filename),
            createdAt: image.created_at ?? new Date().toISOString(),
          });

          return acc;
        }, []);

        if (abortSignal?.aborted) return;

        setAds(mapped);
        setError(null);
      } catch (err) {
        if (abortSignal?.aborted) return;
        console.error("Failed to load library items:", err);
        setAds([]);
        setError("We couldn't load your library items. Please try again.");
        toast.error("Failed to load library items");
      } finally {
        if (!abortSignal?.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    loadLibrary(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadLibrary]);

  const handleRetry = useCallback(() => {
    loadLibrary();
  }, [loadLibrary]);

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

  const filteredAds = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = ads.filter((ad) => {
      const matchesQuery = !q || ad.heading.toLowerCase().includes(q) || ad.platform.toLowerCase().includes(q) || ad.postType.toLowerCase().includes(q);
      const matchesPlatform = platform === "all" || ad.platform.toLowerCase() === platform;
      const matchesPostType = postType === "all" || ad.postType.toLowerCase() === postType;
      return matchesQuery && matchesPlatform && matchesPostType;
    });
    list = list.sort((a, b) => {
      if (sortBy === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sortBy === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);
      return a.heading.localeCompare(b.heading);
    });
    return list;
  }, [ads, query, platform, postType, sortBy]);

  const total = ads.length;
  const last7 = ads.filter(a => (+new Date() - +new Date(a.createdAt)) < 7 * 86400000).length;
  const platformsUsed = new Set(ads.map(a => a.platform)).size;

  const distinctPostTypes = Array.from(new Set(ads.map(a => a.postType.toLowerCase())));
  const distinctPlatforms = Array.from(new Set(ads.map(a => a.platform.toLowerCase())));

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
      
      <div className="relative">
        <div className="absolute -inset-x-4 -top-6 h-24 bg-gradient-to-b from-primary/5 to-transparent blur-2xl -z-10" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Your Ad Library
            </h1>
            <p className="text-muted-foreground mt-1">Manage and organize your created advertisements</p>
          </div>
          <Button onClick={() => router.push('/dashboard/create')} disabled={generatingImage} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
            <FileImage className="w-4 h-4 mr-2" />
            Generate New Ad
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/10 bg-background/40 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total Items</div>
            <div className="text-2xl font-semibold">{total}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/10 bg-background/40 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">New This Week</div>
            <div className="text-2xl font-semibold">{last7}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/10 bg-background/40 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Platforms</div>
            <div className="text-2xl font-semibold">{platformsUsed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-primary/10 bg-background/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, platform or type"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3 md:gap-4">
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All platforms</SelectItem>
                  {distinctPlatforms.map((p) => (
                    <SelectItem key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Post type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All post types</SelectItem>
                  {distinctPostTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="az">A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
              
            <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push('/dashboard/create')}>
                <FileImage className="w-4 h-4" />
              Open in Creator
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
      ) : error ? (
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-4 rounded-full bg-red-500/10">
              <FileImage className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">We hit a snag</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {error}
              </p>
            </div>
            <Button onClick={handleRetry} disabled={loading}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredAds.length === 0 ? (
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Folder className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No ads yet!</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Try adjusting filters or start creating amazing advertisements to see them appear here.
            </p>
            <Button onClick={() => router.push('/dashboard/create')} disabled={generatingImage}>
              <FileImage className="w-4 h-4 mr-2" />
              Create Your First Ad
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing <span className="text-foreground font-medium">{filteredAds.length}</span> of {total}
            </span>
          </div>
          <AdGallery ads={filteredAds} />
        </>
      )}
    </div>
  );
}
  