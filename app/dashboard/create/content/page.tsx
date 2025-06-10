"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Pencil, Bot, Download } from "lucide-react";
import AdGenerationLoader from "@/components/AdGenerationLoader";
import NavigationButtons from "@/components/NavigationButtons";

export default function ContentPage() {
  const [selectedOption, setSelectedOption] = useState<"ai" | "manual" | null>(null);
  const [postHeading, setPostHeading] = useState("");
  const [postSubheading, setPostSubheading] = useState("");
  const [hasCTA, setHasCTA] = useState(false);
  const [ctaText, setCtaText] = useState("");
  const [extraText, setExtraText] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const media = searchParams.get("media");
  const platform = searchParams.get("platform");
  const postType = searchParams.get("postType");
  const settings = searchParams.get("settings");

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

      {/* Heading */}
      <h1 className="text-3xl md:text-3xl font-bold text-disoriti-primary mb-8 text-center tracking-tight animate-glow">
        Configure your post content
      </h1>


      {generatingImage && <AdGenerationLoader />}

      {generatedImage ? (
        <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-disoriti-primary/5 to-disoriti-accent/5 p-8 rounded-2xl border border-disoriti-primary/20">
          <h2 className="text-2xl font-bold mb-6">Your Generated Ad</h2>
          <div className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden mb-6">
            <img src={generatedImage} alt="Generated Ad" className="w-full h-full object-cover" />
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setGeneratedImage(null)}
              className="px-6 py-2 rounded-xl border border-disoriti-primary/30 text-disoriti-primary bg-disoriti-primary/10 font-medium hover:bg-disoriti-primary/20 transition-all"
            >
              ← Back to Content
            </button>
            <button
              onClick={handleDownloadImage}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-disoriti-primary text-white font-medium hover:bg-disoriti-primary/90 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Option Selection */}
          {!selectedOption ? (
            <div className="flex gap-10 w-full justify-center">
              <button
                className="flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40"
                onClick={() => setSelectedOption("ai")}
                type="button"
              >
                <span className="mb-4 flex items-center justify-center">
                  <span className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-disoriti-primary/30 to-disoriti-accent/30 blur-xl animate-pulse" />
                    <Bot className="h-12 w-12 text-disoriti-primary drop-shadow-lg relative z-10" />
                  </span>
                </span>
                <span className="mb-2">Let AI do the magic</span>
                <span className="text-base font-normal text-disoriti-primary/70">
                  Generate post content automatically
                </span>
              </button>

              <button
                className="flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40"
                onClick={() => setSelectedOption("manual")}
                type="button"
              >
                <Pencil className="h-12 w-12 mb-4" />
                <span className="mb-2">Manual post configuration</span>
                <span className="text-base font-normal text-disoriti-primary/70">
                  Enter your own post content
                </span>
              </button>
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
                <h2 className="text-2xl font-bold mb-4">AI Magic Coming Soon!</h2>
                <p className="text-base text-disoriti-primary/70 mb-6 text-center">This feature will generate your post content automatically based on your previous selections.</p>
                <button
                  className="mt-2 px-6 py-2 rounded-xl border border-disoriti-primary/30 text-disoriti-primary bg-disoriti-primary/10 font-medium hover:bg-disoriti-primary/20 transition-all"
                  onClick={() => setSelectedOption(null)}
                >
                  ← Back
                </button>
              </div>
            </div>
           
          ) : (
            // Manual post content form
            <div className="flex justify-center">
              <div className="w-full max-w-2xl bg-gradient-to-br from-disoriti-primary/5 to-disoriti-accent/5 p-8 rounded-2xl border border-disoriti-primary/20">
                <div className="space-y-6">
                  {/* Post Heading */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Post Heading</label>
                    <input
                      type="text"
                      value={postHeading}
                      onChange={(e) => setPostHeading(e.target.value)}
                      className="w-full p-3 bg-white/5 rounded-lg border border-disoriti-primary/20 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40"
                      placeholder="Enter your post heading"
                    />
                  </div>
                  {/* Post Subheading */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Post Subheading</label>
                    <input
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
                      <input
                        type="checkbox"
                        id="has-cta"
                        checked={hasCTA}
                        onChange={(e) => setHasCTA(e.target.checked)}
                        className="w-4 h-4 rounded border-disoriti-primary/20 focus:ring-2 focus:ring-disoriti-primary/40"
                      />
                      <label htmlFor="has-cta" className="text-sm font-medium">
                        Include Call to Action
                      </label>
                    </div>
                    {hasCTA && (
                      <input
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
                    <label className="block text-sm font-medium mb-2">Extra Information (Optional)</label>
                    <textarea
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