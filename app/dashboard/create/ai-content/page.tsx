"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Bot } from "lucide-react";
import NavigationButtons from "@/components/navigation-buttons";
import StepProgress from "@/components/ui/step-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { API_URLS } from "@/lib/api";
import { authenticatedFetch, isUnauthorizedError } from "@/lib/auth";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

// Type definitions for API responses
interface GenerateImageMetadataResponse {
  status_code: number;
  message: string;
  data: {
    heading: string;
    subheading: string;
    CTA: string;
  };
}

function AiContentPageInner() {
  const [postHeading, setPostHeading] = useState("");
  const [postSubheading, setPostSubheading] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{heading: string, subheading: string, cta: string} | null>(null);
  const router = useRouter();
  const { monthlyCreditsLimit, monthlyCreditsUsed } = useAuth();
  
  // Safely get search params with fallbacks
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || "";
  const media = searchParams?.get("media") || "";
  const platform = searchParams?.get("platform") || "";
  const postType = searchParams?.get("postType") || "";
  const settings = searchParams?.get("settings") || "";
  
  // Get prompts from localStorage to avoid URL length issues
  const [prompt, setPrompt] = useState("");
  const [enhanced, setEnhanced] = useState("");

  // Load prompts from localStorage on component mount
  useEffect(() => {
    const storedEnhanced = localStorage.getItem('selectedEnhancedPrompt');
    const storedOriginal = localStorage.getItem('selectedOriginalPrompt');
    
    if (storedEnhanced) {
      setEnhanced(storedEnhanced);
    }
    if (storedOriginal) {
      setPrompt(storedOriginal);
    }
  }, []);

  const handleGenerateContent = async () => {
    setIsGeneratingContent(true);
    
    try {
      // Optional pre-check for content generation credits if same pool applies; if only images consume, remove this
      if (typeof monthlyCreditsLimit === 'number' && typeof monthlyCreditsUsed === 'number' && monthlyCreditsUsed >= monthlyCreditsLimit) {
        setIsGeneratingContent(false);
        return;
      }
      // Use the enhanced prompt from localStorage
      const promptToUse = enhanced || prompt;
      if (!promptToUse) {
        toast.error('No prompt available for content generation');
        setIsGeneratingContent(false);
        return;
      }
      
      // Build the URL with the prompt as a query parameter
      const url = `${API_URLS.GENERATE_IMAGE_METADATA_URL}?prompt=${encodeURIComponent(promptToUse)}`;
      
      // Debug logging
      console.log('API URL Debug:', {
        GENERATE_IMAGE_METADATA_URL: API_URLS.GENERATE_IMAGE_METADATA_URL,
        url,
        promptToUse
      });

      // Safety check: ensure we have a valid URL
      if (!API_URLS.GENERATE_IMAGE_METADATA_URL || API_URLS.GENERATE_IMAGE_METADATA_URL.includes('undefined')) {
        toast.error('API configuration error. Please check your environment setup.');
        setIsGeneratingContent(false);
        return;
      }

      const response = await authenticatedFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Show the message field as the primary error message
        const errorMessage = errorData.message || 'Failed to generate content';
        toast.error(errorMessage);
        setIsGeneratingContent(false);
        return;
      }

      const data: GenerateImageMetadataResponse = await response.json();

      if (data.data?.heading && data.data?.subheading && data.data?.CTA) {
        const generatedContent = {
          heading: data.data.heading,
          subheading: data.data.subheading,
          cta: data.data.CTA
        };
        
        setGeneratedContent(generatedContent);
        setPostHeading(generatedContent.heading);
        setPostSubheading(generatedContent.subheading);
        setCtaText(generatedContent.cta);
        setIsGeneratingContent(false);
        
        toast.success('Content generated successfully!');
      } else {
        toast.error('Invalid response format from server');
        setIsGeneratingContent(false);
      }
    } catch (error) {
      console.error('Generate content error:', error);
      if (!isUnauthorizedError(error)) {
        toast.error('Network or server error');
      }
      setIsGeneratingContent(false);
    }
  };

  const handleGenerateImage = async () => {
    // Navigate to the editor page with the generated content
    const params = new URLSearchParams({
      type,
      media,
      platform,
      postType,
      settings,
      heading: postHeading,
      subheading: postSubheading,
      cta: ctaText
    });
    
    router.push(`/dashboard/create/editor?${params.toString()}`);
  };

  return (
    <div className="space-y-8 p-6 animate-fade-in">
      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full">
        <StepProgress currentStep={6} totalSteps={6} />
      </div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/create">Create</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={type ? `/dashboard/create/media?type=${type}` : "/dashboard/create/media"}>Media Type</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={type && media ? `/dashboard/create/upload?type=${type}&media=${media}` : "/dashboard/create/upload"}>
              Post Type
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={type && media && platform && postType ? `/dashboard/create/editor?type=${type}&media=${media}&platform=${platform}&postType=${postType}` : "/dashboard/create/editor"}>
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>AI Content</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* AI Content Generation Interface */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-gradient-to-br from-disoriti-primary/5 to-disoriti-accent/5 p-8 rounded-2xl border border-disoriti-primary/20 flex flex-col items-center">
          <span className="mb-4 flex items-center justify-center">
            <span className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-disoriti-primary/30 to-disoriti-accent/30 blur-xl animate-pulse" />
              <Bot className="h-16 w-16 text-disoriti-primary drop-shadow-lg relative z-10" />
            </span>
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Generate Content from Image Prompt</h2>
          <p className="text-disoriti-primary/80 mb-6 text-center text-lg">
            We’ll propose a heading, subheading and CTA to match your visual. You can tweak them now or later.
          </p>
          
          {/* Show the selected prompt */}
          {enhanced && (
            <div className="w-full mb-6 p-4 bg-background/50 rounded-lg border border-disoriti-primary/20">
              <h3 className="text-sm font-medium text-disoriti-primary mb-2">Selected Image Prompt:</h3>
              <p className="text-sm text-muted-foreground">{enhanced}</p>
            </div>
          )}
          
          {isGeneratingContent ? (
            <div className="w-full flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-disoriti-primary mb-4"></div>
              <p className="text-disoriti-primary/70">Generating content...</p>
            </div>
          ) : generatedContent ? (
            <div className="w-full space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-4 bg-background/50 rounded-lg border-2 border-primary cursor-help">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-disoriti-primary">Generated Content:</h3>
                        <span className="text-base text-primary animate-pulse drop-shadow-[0_0_8px_hsl(var(--primary))]">💡</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="ai-heading" className="text-xs text-muted-foreground block mb-2">Heading:</Label>
                          <Input
                            id="ai-heading"
                            type="text"
                            value={postHeading}
                            onChange={(e) => setPostHeading(e.target.value)}
                            className="w-full p-3 bg-background/80 rounded-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter heading"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-subheading" className="text-xs text-muted-foreground block mb-2">Subheading:</Label>
                          <Input
                            id="ai-subheading"
                            type="text"
                            value={postSubheading}
                            onChange={(e) => setPostSubheading(e.target.value)}
                            className="w-full p-3 bg-background/80 rounded-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter subheading"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-cta" className="text-xs text-muted-foreground block mb-2">CTA:</Label>
                          <Input
                            id="ai-cta"
                            type="text"
                            value={ctaText}
                            onChange={(e) => setCtaText(e.target.value)}
                            className="w-full p-3 bg-background/80 rounded-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter call to action"
                          />
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">You can always edit the heading, subheading, and CTA in our editor!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <Button
              onClick={handleGenerateContent}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md px-8 py-6 text-lg rounded-full transition-transform transform hover:scale-105"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Generate Content
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <NavigationButtons
        onPrevious={() => router.back()}
        onNext={handleGenerateImage}
        disablePrevious={false}
        disableNext={!generatedContent}
        nextLabel="Generate Image →"
      />
    </div>
  );
}

export default function AiContentPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8 p-6">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-gray-100 rounded-2xl p-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    }>
      <AiContentPageInner />
    </Suspense>
  );
} 