"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Pencil, Bot, Download, ChevronLeft, Save } from "lucide-react";
import AdGenerationLoader from "@/components/ad-generation-loader";
import NavigationButtons from "@/components/navigation-buttons";
import AdLayoutSVG from "@/components/AdLayoutSVG";
import type { Layout, ElementData, Styling } from "@/components/AdLayoutSVG";
import layoutDataRaw from "../../../../output_sample.json";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdLayoutControls from "@/components/AdLayoutControls";
import * as htmlToImage from "html-to-image";
import AdLayoutPreview from "@/components/AdLayoutPreview";
import { Switch } from "@/components/ui/switch";
const layoutData = layoutDataRaw as { layouts: Layout[], metadata: any };

// Parse aspect ratio from post_dimensions (e.g., "4:3")
function getAspectRatio(dim: string | undefined): [number, number] {
  if (!dim) return [1, 1];
  const match = dim.match(/(\d+):(\d+)/);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10)];
  }
  return [1, 1];
}

const [aspectW, aspectH] = getAspectRatio(layoutData.metadata?.post_dimensions);
const MAIN_DISPLAY_WIDTH = 500;
const MAIN_DISPLAY_HEIGHT = Math.round((MAIN_DISPLAY_WIDTH * aspectH) / aspectW);
const TILE_WIDTH = 120;
const TILE_HEIGHT = Math.round((TILE_WIDTH * aspectH) / aspectW);

export default function ContentPage() {
  const [selectedOption, setSelectedOption] = useState<"ai" | "manual" | null>(null);
  const [postHeading, setPostHeading] = useState("");
  const [postSubheading, setPostSubheading] = useState("");
  const [hasCTA, setHasCTA] = useState(false);
  const [ctaText, setCtaText] = useState("");
  const [extraText, setExtraText] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedLayoutIdx, setSelectedLayoutIdx] = useState(0);
  const [layouts, setLayouts] = useState(layoutData.layouts);
  const [selectedElement, setSelectedElement] = useState<"heading" | "subheading" | "cta" | null>(null);
  const [imageEdits, setImageEdits] = useState({ brightness: 100, contrast: 100, saturation: 100 });
  const [logoPosition, setLogoPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-left');
  const [logoColor, setLogoColor] = useState<string>("#ffffff");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const media = searchParams.get("media");
  const platform = searchParams.get("platform");
  const postType = searchParams.get("postType");
  const settings = searchParams.get("settings");
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

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
    // Simulate API call to generate image
    setTimeout(() => {
      // Replace with actual API response
      setGeneratedImage("/image.png");
      setGeneratingImage(false);
    }, 3000);
  };

  const handleLayoutChange = (newLayout: Layout, index: number) => {
    const newLayouts = [...layouts];
    newLayouts[index] = newLayout;
    setLayouts(newLayouts);
  };

  const handleStyleChange = (type: "heading" | "subheading" | "cta", key: keyof Styling, value: string | number) => {
    const newLayouts = [...layouts];
    const newLayout = { ...newLayouts[selectedLayoutIdx] };
    (newLayout.elements[type].styling as any)[key] = value;
    newLayouts[selectedLayoutIdx] = newLayout;
    setLayouts(newLayouts);
  };

  const handleElementChange = (newElements: { heading: ElementData; subheading: ElementData; cta: ElementData }) => {
    const newLayouts = [...layouts];
    newLayouts[selectedLayoutIdx].elements = newElements;
    setLayouts(newLayouts);
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
            <BreadcrumbLink href={`/dashboard/create/media?type=${type}`}>Media Type</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/create/upload?type=${type}&media=${media}`}>
              Post Type
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/create/editor?type=${type}&media=${media}&platform=${platform}&postType=${postType}`}>
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
        <div className="w-full max-w-7xl mx-auto flex-1">
          <div className="bg-background p-6 rounded-2xl border border-border shadow-lg flex flex-row gap-4 items-start justify-center">
            {/* Tiles on the left (catalogue) */}
            <div className="flex flex-col gap-4 items-center w-[150px] flex-shrink-0">
              <h3 className="font-semibold text-lg text-foreground mb-2 pt-1 w-full">Layouts</h3>
              <div className="flex flex-col gap-4 items-center w-full">
                {layoutData.layouts.map((layout, idx) => (
                  <div
                    key={layout.id || idx}
                    className={`rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedLayoutIdx === idx ? "border-primary shadow-primary/30 shadow-lg" : "border-border"}`}
                    style={{ background: "#fff", width: 140, height: 140, overflow: "hidden" }}
                    onClick={() => setSelectedLayoutIdx(idx)}
                  >
                    <AdLayoutSVG
                      imageUrl={generatedImage || "/image.png"}
                      layout={layout}
                      width={140}
                      height={140}
                      selected={null}
                      pointerEventsNone={true}
                      showLogo={false}
                      filter={`brightness(${imageEdits.brightness}%) contrast(${imageEdits.contrast}%) saturate(${imageEdits.saturation}%)`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-px bg-border self-stretch my-4" />
            
            {/* Main display area (center) */}
            <div className="flex-1 flex flex-col items-center justify-start gap-4">
              <div ref={previewRef} className="w-full max-w-[500px] aspect-square bg-background/50 rounded-lg border border-primary/40 shadow-[0_0_20px_4px_hsl(var(--primary)/0.5)] overflow-hidden"
                onClick={e => {
                  if (e.target === e.currentTarget) setSelectedElement(null);
                }}
              >
                <AdLayoutSVG
                  imageUrl={generatedImage || "/image.png"}
                  layout={layouts[selectedLayoutIdx]}
                  width={500}
                  height={500}
                  selected={selectedElement}
                  onSelectElement={setSelectedElement}
                  onElementsChange={handleElementChange}
                  filter={`brightness(${imageEdits.brightness}%) contrast(${imageEdits.contrast}%) saturate(${imageEdits.saturation}%)`}
                  logoPosition={logoPosition}
                  logoColor={logoColor}
                  logoImage={logoImage}
                />
              </div>
              {/* Hidden export preview for image download */}
              <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div ref={exportRef}>
                  <AdLayoutPreview
                    imageUrl={generatedImage || ""}
                    layout={layouts[selectedLayoutIdx]}
                    width={500}
                    height={500}
                    logoImage={logoImage}
                    logoPosition={logoPosition}
                    logoColor={logoColor}
                  />
                </div>
              </div>
              <div className="w-full max-w-[500px]">
                <NavigationButtons
                  onPrevious={() => setGeneratedImage(null)}
                  onNext={handleDownload}
                  nextLabel={<><Save className="w-4 h-4 mr-2" />Save</>}
                />
              </div>
            </div>

            <div className="w-px bg-border self-stretch my-4" />

            {/* Controls on the right */}
            <div className="w-[280px] flex-shrink-0">
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
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Option Selection */}
          {!selectedOption ? (
            <div className="flex gap-10 w-full justify-center">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 keep-text-visible"
                style={{ backgroundColor: '#000' }}
                onClick={() => setSelectedOption("ai")}
              >
                <span className="mb-4 flex items-center justify-center text-white z-10">
                  <span className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-disoriti-primary/30 to-disoriti-accent/30 blur-xl animate-pulse" />
                    <Bot className="h-12 w-12 text-disoriti-primary drop-shadow-lg relative z-10" />
                  </span>
                </span>
                <span className="mb-2 text-white z-10">Let AI do the magic</span>
                <span className="text-base font-normal text-white z-10">
                  Generate post content automatically
                </span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 keep-text-visible"
                style={{ backgroundColor: '#000' }}
                onClick={() => setSelectedOption("manual")}
              >
                <Pencil className="h-12 w-12 mb-4 text-white z-10" />
                <span className="mb-2 text-white z-10">Manual post configuration</span>
                <span className="text-base font-normal text-white z-10">
                  Enter your own post content
                </span>
              </Button>
            </div>
          ) : selectedOption === "ai" ? (
            <div className="flex justify-center">
            <div className="w-full max-w-2xl bg-gradient-to-br from-disoriti-primary/5 to-disoriti-accent/5 p-8 rounded-2xl border border-disoriti-primary/20 flex flex-col items-center">
                <span className="mb-4 flex items-center justify-center">
                  <span className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-disoriti-primary/30 to-disoriti-accent/30 blur-xl animate-pulse" />
                    <Bot className="h-16 w-16 text-disoriti-primary drop-shadow-lg relative z-10" />
                  </span>
                </span>
                <h2 className="text-2xl font-bold mb-4">Let AI do the magic</h2>
                <p className="text-disoriti-primary/70 mb-6 text-center">
                  Our AI will generate the perfect post content for you based on the media and settings you provided.
                </p>
                <Button
                  onClick={handleGenerateImage}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md px-8 py-6 text-lg rounded-full transition-transform transform hover:scale-105"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  Generate Post
                </Button>
            </div>
            </div>
          ) : (
            // Manual form
            <div className="flex justify-center">
              <div className="w-full max-w-2xl bg-background p-8 rounded-2xl border border-disoriti-primary/20">
                <h2 className="text-2xl font-bold mb-6 text-center">Manual Post Configuration</h2>
                <div className="space-y-6">
                  {/* Post Heading */}
                  <div>
                    <Label htmlFor="post-heading" className="mb-2 block">Post Heading</Label>
                    <Input
                      id="post-heading"
                      type="text"
                      value={postHeading}
                      onChange={(e) => setPostHeading(e.target.value)}
                      className="w-full p-3 bg-white/5 rounded-lg border border-disoriti-primary/20 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40"
                      placeholder="Enter your post heading"
                    />
                  </div>
                  {/* Post Subheading */}
                  <div>
                    <Label htmlFor="post-subheading" className="mb-2 block">Post Subheading</Label>
                    <Input
                      id="post-subheading"
                      type="text"
                      value={postSubheading}
                      onChange={(e) => setPostSubheading(e.target.value)}
                      className="w-full p-3 bg-white/5 rounded-lg border border-disoriti-primary/20 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40"
                      placeholder="Enter your post subheading"
                    />
                  </div>
                  {/* Call to Action */}
                  <div>
                    <div className="flex items-center gap-3">
                      <Switch
                        id="has-cta"
                        checked={hasCTA}
                        onCheckedChange={setHasCTA}
                      />
                      <Label htmlFor="has-cta" className="text-sm font-medium">
                        Include Call to Action
                      </Label>
                    </div>
                    {hasCTA && (
                      <Input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full p-3 bg-white/5 rounded-lg border border-disoriti-primary/20 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 mt-2"
                        placeholder="Enter call to action text"
                      />
                    )}
                  </div>
                  {/* Extra Text/Information */}
                  <div>
                    <Label htmlFor="extra-text" className="mb-2 block">Extra Text</Label>
                    <Input
                      id="extra-text"
                      type="text"
                      value={extraText}
                      onChange={(e) => setExtraText(e.target.value)}
                      className="w-full p-3 bg-white/5 rounded-lg border border-disoriti-primary/20 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 min-h-[100px] resize-y"
                      placeholder="Add any additional information for your post"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <NavigationButtons
            onPrevious={() => {
              if (selectedOption) {
                setSelectedOption(null);
              } else {
                router.back();
              }
            }}
            onNext={() => {
              if (postHeading) {
                handleGenerateImage();
              }
            }}
            disablePrevious={false}
            disableNext={!postHeading || selectedOption !== "manual"}
            nextLabel="Generate Ad →"
          />
        </>
      )}
    </div>
  );
} 