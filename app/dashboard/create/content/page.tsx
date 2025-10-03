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
import { Sparkles, Pencil, Bot, Download, ChevronLeft, Save, Undo2, Redo2, Type } from "lucide-react";
import AdGenerationLoader from "@/components/ad-generation-loader";
import NavigationButtons from "@/components/navigation-buttons";
import AdLayoutSVG from "@/components/AdLayoutSVG";
import type { Layout, ElementData, Styling } from "@/components/AdLayoutSVG";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdLayoutControls from "@/components/AdLayoutControls";
import * as htmlToImage from "html-to-image";
import AdLayoutPreview from "@/components/AdLayoutPreview";
import { Switch } from "@/components/ui/switch";
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

// Layout data will be populated from API response
const defaultLayouts: Layout[] = [];

// Normalize API layout (which may be normalized 0..1 coords and RGBA hex) into our 1080px space and styling
function normalizeApiLayouts(apiLayouts: any[]): Layout[] {
  const toSixHexAndAlpha = (hex: string): { hex6: string; alpha?: number } => {
    if (!hex || typeof hex !== 'string') return { hex6: '#000000' };
    const cleaned = hex.trim();
    if (cleaned.length === 9 && cleaned.startsWith('#')) {
      const rr = cleaned.slice(1, 3);
      const gg = cleaned.slice(3, 5);
      const bb = cleaned.slice(5, 7);
      const aa = cleaned.slice(7, 9);
      const alpha = Math.max(0, Math.min(1, parseInt(aa, 16) / 255));
      return { hex6: `#${rr}${gg}${bb}`, alpha };
    }
    return { hex6: cleaned };
  };

  const toPx = (v: number) => (v <= 1 ? v * 1080 : v);

  const normalizeElement = (key: 'heading' | 'subheading' | 'cta', el: any): ElementData => {
    const { hex6: bgHex, alpha: bgAlpha } = toSixHexAndAlpha(el?.styling?.background_color || '#000000');
    const { hex6: textHex, alpha: textAlpha } = toSixHexAndAlpha(el?.styling?.color || '#FFFFFF');
    const base: ElementData = {
      bbox: {
        x: toPx(el?.bbox?.x ?? 0),
        y: toPx(el?.bbox?.y ?? 0),
        width: toPx(el?.bbox?.width ?? 0),
        height: toPx(el?.bbox?.height ?? 0),
      },
      styling: {
        font_size: el?.styling?.font_size ?? 32,
        font_weight: el?.styling?.font_weight ?? (key === 'heading' ? 'bold' : 'normal'),
        text_align: el?.styling?.text_align ?? 'left',
        color: textHex,
        color_opacity: textAlpha ?? 1,
        background_color: bgHex,
        background_opacity: bgAlpha ?? (key === 'cta' ? 1 : 0),
        margin: el?.styling?.margin ?? 0,
        font_family: el?.styling?.font_family,
        letter_spacing: el?.styling?.letter_spacing,
        text_transform: el?.styling?.text_transform,
        line_height: el?.styling?.line_height,
      },
      text_content: el?.text_content ?? '',
    };
    return base;
  };

  return (apiLayouts || []).map((ly: any): Layout => ({
    id: ly?.id || 'layout',
    style: ly?.style || 'auto',
    elements: {
      heading: normalizeElement('heading', ly?.elements?.heading || {}),
      subheading: normalizeElement('subheading', ly?.elements?.subheading || {}),
      cta: normalizeElement('cta', ly?.elements?.cta || {}),
    },
  }));
}

function getAspectRatio(dim: string | undefined): [number, number] {
  if (!dim) return [1, 1];
  const [width, height] = dim.split('x').map(Number);
  return [width, height];
}

function DateClient({ iso, options }: { iso: string; options?: Intl.DateTimeFormatOptions }) {
  const date = new Date(iso).toLocaleDateString(undefined, options);
  return <span>{date}</span>;
}

// If you render any dates/times in this file, use <DateClient iso={...} /> instead of new Date().toLocaleDateString().
// Store all dates as ISO strings in state/props, not as Date objects.
// If you need to display a time, use a similar TimeClient component.

function ContentPageInner() {
  const [postHeading, setPostHeading] = useState("");
  const [postSubheading, setPostSubheading] = useState("");
  const [hasCTA, setHasCTA] = useState(false);
  const [ctaText, setCtaText] = useState("");
  const [extraText, setExtraText] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedLayoutIdx, setSelectedLayoutIdx] = useState(0);
  const [layouts, setLayouts] = useState<Layout[]>(defaultLayouts);
  const [selectedElement, setSelectedElement] = useState<"heading" | "subheading" | "cta" | null>(null);
  const [customTextVisible, setCustomTextVisible] = useState<boolean>(false);
  const [imageEdits, setImageEdits] = useState({ brightness: 100, contrast: 100, saturation: 100 });
  const [logoPosition, setLogoPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-left');
  const [logoColor, setLogoColor] = useState<string>("#ffffff");
  const [logoImage, setLogoImage] = useState<string | null>("/logo-primary.png");
  const [logoBbox, setLogoBbox] = useState({ x: 24, y: 24, width: 80, height: 80 });
  const [selectedLogo, setSelectedLogo] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{heading: string, subheading: string, cta: string} | null>(null);
  const router = useRouter();
  const { monthlyCreditsLimit, monthlyCreditsUsed, monthlyCreditsResetAt, setCreditsFromServer } = useAuth();
  
  // Safely get search params with fallbacks
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || "";
  const media = searchParams?.get("media") || "";
  const platform = searchParams?.get("platform") || "";
  const postType = searchParams?.get("postType") || "";
  const settings = searchParams?.get("settings") || "";
  const autoGenerate = searchParams?.get("autoGenerate") === "true";
  
  // Get prompts from localStorage to avoid URL length issues
  const [prompt, setPrompt] = useState("");
  const [enhanced, setEnhanced] = useState("");
  
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

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

  // Keyboard shortcuts: T/H/S/C to add text
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!generatedImage) return;
      const key = e.key.toLowerCase();
      if (key === 't') { e.preventDefault(); handleAddText(); }
      if (key === 'h') { e.preventDefault(); handleAddText('heading'); }
      if (key === 's') { e.preventDefault(); handleAddText('subheading'); }
      if (key === 'c') { e.preventDefault(); handleAddText('cta'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [generatedImage, layouts, selectedLayoutIdx]);

  // Auto-generate image when autoGenerate flag is true
  useEffect(() => {
    if (autoGenerate && enhanced && !generatingImage && !generatedImage) {
      // Set some default content values for the image generation
      setPostHeading("Amazing Content");
      setPostSubheading("Discover something incredible");
      setCtaText("Learn More");
      setGeneratedContent({
        heading: "Amazing Content",
        subheading: "Discover something incredible", 
        cta: "Learn More"
      });
      
      // Trigger image generation after a short delay to ensure state is set
      setTimeout(() => {
        handleGenerateImage();
      }, 500);
    }
  }, [autoGenerate, enhanced, generatingImage, generatedImage]);

  const handleDownload = async () => {
    if (exportRef.current) {
      const dataUrl = await htmlToImage.toPng(exportRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'generated-ad.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    
    try {
      // Use the enhanced prompt from localStorage
      const promptToUse = enhanced || prompt;
      if (!promptToUse) {
        toast.error('No prompt available for image generation');
        setGeneratingImage(false);
        return;
      }

      // Check if we have content (either generated or manually entered) - skip this check if autoGenerate is true
      if (!autoGenerate && !generatedContent && (!postHeading.trim() || !postSubheading.trim() || !ctaText.trim())) {
        toast.error('Please generate content first or fill in all fields');
        setGeneratingImage(false);
        return;
      }

      // Use current edited values or fallback to generated content
      const currentHeading = postHeading.trim() || (generatedContent?.heading || '');
      const currentSubheading = postSubheading.trim() || (generatedContent?.subheading || '');
      const currentCta = ctaText.trim() || (generatedContent?.cta || '');
      
      // Build the URL with query parameters
      const url = `${API_URLS.GENERATE_IMAGE_URL}?enhanced_prompt=${encodeURIComponent(promptToUse)}&post_size=1024x896`;
      
      console.log('Generate Image API URL:', url);
      console.log('Content being sent:', {
        currentHeading,
        currentSubheading,
        currentCta,
        postHeading,
        postSubheading,
        ctaText,
        generatedContent
      });

      // Block if credits exhausted
      if (typeof monthlyCreditsLimit === 'number' && typeof monthlyCreditsUsed === 'number' && monthlyCreditsUsed >= monthlyCreditsLimit) {
        toast.error('Monthly credits exhausted');
        setGeneratingImage(false);
        return;
      }

      const response = await authenticatedFetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_heading: currentHeading,
          image_subheading: currentSubheading,
          image_cta: currentCta
        }),
      });

      if (!response.ok) {
        if (response.status === 402) {
          try {
            const err = await response.json();
            toast.error(err?.message || 'Monthly credits exhausted');
          } catch {
            toast.error('Monthly credits exhausted');
          }
          setGeneratingImage(false);
          return;
        }
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed to generate image';
        toast.error(errorMessage);
        setGeneratingImage(false);
        return;
      }

      const data = await response.json();
      
      if (data.status_code === 200 && data.data) {
        // The response contains both image and layout data
        if (typeof data.data === 'string') {
          // Legacy format: only base64 image
          setGeneratedImage(data.data);
        } else if (data.data.image && data.data.layout) {
          // New format: both image and layout data
          setGeneratedImage(data.data.image);
          
          // Update layouts with the new layout data from API
          if (data.data.layout.layouts && Array.isArray(data.data.layout.layouts)) {
            const normalized = normalizeApiLayouts(data.data.layout.layouts);
            // Keep only first layout option
            const firstOnly = normalized.length > 0 ? [normalized[0]] : normalized;
            // Hide default heading/subheading/cta initially; user can add text later
            if (firstOnly[0]) {
              firstOnly[0] = {
                ...firstOnly[0],
                elements: {
                  ...firstOnly[0].elements,
                  heading: { ...firstOnly[0].elements.heading, hidden: true, text_content: firstOnly[0].elements.heading.text_content || "" },
                  subheading: { ...firstOnly[0].elements.subheading, hidden: true, text_content: firstOnly[0].elements.subheading.text_content || "" },
                  cta: { ...firstOnly[0].elements.cta, hidden: true, text_content: firstOnly[0].elements.cta.text_content || "" },
                }
              };
            }
            setLayouts(firstOnly);
            setSelectedLayoutIdx(0);
          }
        } else {
          toast.error('Invalid response format from server');
          setGeneratingImage(false);
          return;
        }
        
        // Update credits from response
        if (data?.data?.credits) {
          const { limit, used, reset_at } = data.data.credits;
          if (typeof limit === 'number' && typeof used === 'number') {
            setCreditsFromServer?.({ limit, used, reset_at });
          }
        }

        setGeneratingImage(false);
        toast.success('Image generated successfully!');
      } else {
        toast.error('Invalid response format from server');
        setGeneratingImage(false);
      }
    } catch (error) {
      console.error('Generate image error:', error);
      if (!isUnauthorizedError(error)) {
        toast.error('Network or server error');
      }
      setGeneratingImage(false);
    }
  };

  const pushHistory = () => {
    const snapshot = {
      layouts: JSON.parse(JSON.stringify(layouts)),
      selectedLayoutIdx,
      logoBbox: JSON.parse(JSON.stringify(logoBbox)),
      logoImage,
    };
    setHistory((h) => [...h, snapshot]);
    setFuture([]);
  };

  const handleUndo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [...f, { layouts, selectedLayoutIdx, logoBbox, logoImage }]);
      setLayouts(prev.layouts);
      setSelectedLayoutIdx(prev.selectedLayoutIdx);
      setLogoBbox(prev.logoBbox);
      setLogoImage(prev.logoImage);
      return h.slice(0, -1);
    });
  };

  const handleRedo = () => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[f.length - 1];
      setHistory((h) => [...h, { layouts, selectedLayoutIdx, logoBbox, logoImage }]);
      setLayouts(next.layouts);
      setSelectedLayoutIdx(next.selectedLayoutIdx);
      setLogoBbox(next.logoBbox);
      setLogoImage(next.logoImage);
      return f.slice(0, -1);
    });
  };

  const handleLayoutChange = (newLayout: Layout, index: number) => {
    pushHistory();
    const newLayouts = [...layouts];
    newLayouts[index] = newLayout;
    setLayouts(newLayouts);
  };

  const handleAddText = (explicitType?: "heading" | "subheading" | "cta") => {
    pushHistory();
    const current = layouts[selectedLayoutIdx];
    const newLayouts = [...layouts];
    // Decide which element to use next: heading -> subheading -> cta
    let nextType: "heading" | "subheading" | "cta" = explicitType || "heading";
    if (!explicitType) {
      if (!current.elements.heading.hidden) {
        nextType = !current.elements.subheading.hidden ? "cta" : "subheading";
      }
    }
    const defaults: Record<"heading"|"subheading"|"cta", { x: number; y: number; w: number; h: number; text: string; } > = {
      heading: { x: 80, y: 820, w: 840, h: 120, text: "Your text here" },
      subheading: { x: 80, y: 920, w: 840, h: 100, text: "Add more details" },
      cta: { x: 80, y: 1040-140, w: 360, h: 80, text: "Call to Action" },
    };
    const d = defaults[nextType];
    newLayouts[selectedLayoutIdx] = {
      ...current,
      elements: {
        ...current.elements,
        [nextType]: {
          ...current.elements[nextType],
          hidden: false,
          text_content: current.elements[nextType].text_content || d.text,
          bbox: {
            ...current.elements[nextType].bbox,
            x: current.elements[nextType].bbox.x || d.x,
            y: current.elements[nextType].bbox.y || d.y,
            width: current.elements[nextType].bbox.width || d.w,
            height: current.elements[nextType].bbox.height || d.h,
          }
        }
      }
    };
    setLayouts(newLayouts);
    setSelectedElement(nextType);
  };

  const handleStyleChange = (type: "heading" | "subheading" | "cta", key: keyof Styling, value: string | number) => {
    pushHistory();
    const newLayouts = [...layouts];
    const newLayout = { ...newLayouts[selectedLayoutIdx] };
    (newLayout.elements[type].styling as any)[key] = value;
    newLayouts[selectedLayoutIdx] = newLayout;
    setLayouts(newLayouts);
  };

  const handleElementChange = (newElements: { heading: ElementData; subheading: ElementData; cta: ElementData }) => {
    pushHistory();
    const newLayouts = [...layouts];
    newLayouts[selectedLayoutIdx].elements = newElements;
    setLayouts(newLayouts);
  };

  const handleGenerateContent = async () => {
    setIsGeneratingContent(true);
    
    try {
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

  const handleNavigateToAiContent = () => {
    const params = new URLSearchParams({
      type,
      media,
      platform,
      postType,
      settings
    });
    router.push(`/dashboard/create/ai-content?${params.toString()}`);
  };

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
            <BreadcrumbPage>Content</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {generatingImage && <AdGenerationLoader />}

      {generatedImage ? (
        <div className="w-full max-w-[1700px] mx-auto flex-1">
          <div className="bg-background p-4 rounded-2xl border border-border shadow-lg flex flex-row gap-6 items-start justify-center">
            
            {/* Main display area (center) */}
            <div className="flex-1 flex flex-col items-center justify-start gap-4">
              <div ref={previewRef} className="w-full max-w-[1024px] aspect-[4/3] bg-background/50 rounded-lg border border-primary/40 shadow-[0_0_20px_4px_hsl(var(--primary)/0.5)] overflow-hidden relative"
                onClick={e => {
                  if (e.target === e.currentTarget) {
                    setSelectedElement(null);
                    setSelectedLogo(false);
                  }
                }}
              >
                <AdLayoutSVG
                  imageUrl={generatedImage || "/image.png"}
                  layout={layouts[selectedLayoutIdx]}
                  width={1024}
                  height={768}
                  selected={selectedElement}
                  onSelectElement={setSelectedElement}
                  onElementsChange={handleElementChange}
                  filter={`brightness(${imageEdits.brightness}%) contrast(${imageEdits.contrast}%) saturate(${imageEdits.saturation}%)`}
                  logoPosition={logoPosition}
                  logoColor={logoColor}
                  logoImage={logoImage}
                  logoBbox={logoBbox}
                  onLogoBboxChange={setLogoBbox}
                  selectedLogo={selectedLogo}
                  onLogoSelect={setSelectedLogo}
                />
                
              </div>
              {/* Add Text Dock (below image) */}
              <div className="w-full flex justify-center mt-2">
                <div className="flex items-center gap-2 rounded-full bg-background/80 border border-primary/20 backdrop-blur-md px-2 py-1 shadow-glow-sm z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddText('heading'); }}
                    className="px-3 py-1.5 rounded-full text-xs md:text-sm bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:from-primary/30 hover:to-accent/30 text-foreground transition-colors flex items-center gap-1"
                  >
                    <Type className="w-3 h-3" /> Heading <span className="hidden md:inline text-muted-foreground">(H)</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddText('subheading'); }}
                    className="px-3 py-1.5 rounded-full text-xs md:text-sm bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:from-primary/30 hover:to-accent/30 text-foreground transition-colors flex items-center gap-1"
                  >
                    <Type className="w-3 h-3" /> Subheading <span className="hidden md:inline text-muted-foreground">(S)</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddText('cta'); }}
                    className="px-3 py-1.5 rounded-full text-xs md:text-sm bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:from-primary/30 hover:to-accent/30 text-foreground transition-colors flex items-center gap-1"
                  >
                    <Type className="w-3 h-3" /> CTA <span className="hidden md:inline text-muted-foreground">(C)</span>
                  </button>
                </div>
              </div>
              {/* Hidden export preview for image download */}
              <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div ref={exportRef}>
                  <AdLayoutPreview
                    imageUrl={generatedImage || ""}
                    layout={layouts[selectedLayoutIdx]}
                    width={1024}
                    height={768}
                    logoImage={logoImage}
                    logoPosition={logoPosition}
                    logoColor={logoColor}
                    logoBbox={logoBbox}
                    filter={`brightness(${imageEdits.brightness}%) contrast(${imageEdits.contrast}%) saturate(${imageEdits.saturation}%)`}
                  />
                </div>
              </div>
              <div className="w-full max-w-[1024px]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="text-white hover:text-white" onClick={handleUndo} disabled={history.length === 0} aria-label="Undo">
                      <Undo2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-white hover:text-white" onClick={handleRedo} disabled={future.length === 0} aria-label="Redo">
                      <Redo2 className="w-4 h-4" />
                    </Button>
                    {/* Removed legacy Add Text button for cleaner UI */}
                  </div>
                  <NavigationButtons
                    onPrevious={() => setGeneratedImage(null)}
                    onNext={handleDownload}
                    nextLabel={<><Save className="w-4 h-4 mr-2" />Save</>}
                  />
                </div>
              </div>
            </div>

            <div className="w-px bg-border self-stretch my-4" />

            {/* Controls on the right */}
            <div className="w-[300px] flex-shrink-0">
              <AdLayoutControls
                elements={layouts[selectedLayoutIdx].elements}
                selected={selectedElement}
                onStyleChange={handleStyleChange}
                onImageEdit={setImageEdits}
                onImageReplace={file => {
                  const url = URL.createObjectURL(file);
                  setGeneratedImage(url);
                }}
                logoPosition={logoPosition}
                onLogoPositionChange={setLogoPosition}
                logoColor={logoColor}
                onLogoColorChange={setLogoColor}
                onLogoReplace={file => {
                  const reader = new FileReader();
                  reader.onload = e => setLogoImage(e.target?.result as string);
                  reader.readAsDataURL(file);
                }}
                selectedLogo={selectedLogo}
                onLogoSelect={setSelectedLogo}
                showGrid={showGrid}
                onShowGridChange={setShowGrid}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Direct AI Content Generation Interface */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl bg-gradient-to-br from-disoriti-primary/5 to-disoriti-accent/5 p-8 rounded-2xl border border-disoriti-primary/20 flex flex-col items-center">
              <span className="mb-4 flex items-center justify-center">
                <span className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-disoriti-primary/30 to-disoriti-accent/30 blur-xl animate-pulse" />
                  <Bot className="h-16 w-16 text-disoriti-primary drop-shadow-lg relative z-10" />
                </span>
              </span>
              <h2 className="text-2xl font-bold mb-4">Generate Content from Image Prompt</h2>
              <p className="text-disoriti-primary/70 mb-6 text-center">
                Our AI will generate the perfect heading, subheading, and CTA based on your image prompt.
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
                <div className="w-full flex flex-col items-center">
                  <p className="text-muted-foreground">Content generated successfully!</p>
                  {/* Generated Content Section - Commented Out */}
                  {/*
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
                  */}
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
        </>
      )}
    </div>
  );
}

export default function ContentPage() {
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
      <ContentPageInner />
    </Suspense>
  );
}