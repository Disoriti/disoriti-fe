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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect, Suspense } from "react";
import VisionLayoutRenderer from "@/components/VisionLayoutRenderer";
import type { DisoritiLayout, SceneDigest } from "@/lib/vision-layout-types";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Wand2, ArrowRight, Loader2, ImageIcon, Eye } from "lucide-react";
import NavigationButtons from "@/components/navigation-buttons";
import { API_URLS } from "@/lib/api";
import { authenticatedFetch, isUnauthorizedError, getToken } from "@/lib/auth";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function EnhancePromptPageInner() {
  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [savedPrompts, setSavedPrompts] = useState<Array<{prompt: string, enhanced: string, timestamp: string}>>([]);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [editablePrompt, setEditablePrompt] = useState("");
  const [editableEnhancedPrompt, setEditableEnhancedPrompt] = useState("");
  const maxCredits = 5;
  const router = useRouter();
  const { logout } = useAuth();
  // Vision layout demo state (placeholder integration point)
  const [visionLayout, setVisionLayout] = useState<DisoritiLayout | null>(null);
  const [sceneDigest, setSceneDigest] = useState<SceneDigest | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/image.png");
  
  // Reference image state
  const [wantsReference, setWantsReference] = useState<boolean | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [isGeneratingReference, setIsGeneratingReference] = useState(false);
  const [referenceProgress, setReferenceProgress] = useState(0);
  
  // Safely get search params with fallbacks
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || "";
  const media = searchParams?.get("media") || "";
  const platform = searchParams?.get("platform") || "";
  const postType = searchParams?.get("postType") || "";
  const hasReference = searchParams?.get("hasReference") === "true";

  // If coming from reference image creator, auto-select reference flow
  useEffect(() => {
    if (hasReference) setWantsReference(true);
  }, [hasReference]);

  // Handle reference image upload
  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setReferenceImage(file);
      const url = URL.createObjectURL(file);
      setReferencePreview(url);
    }
  };

  // Generate reference image content
  const handleGenerateReference = async () => {
    if (!referenceImage) return;
    
    setIsGeneratingReference(true);
    setReferenceProgress(0);
    
    const progressInterval = setInterval(() => {
      setReferenceProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('image', referenceImage);
      if (prompt.trim()) formData.append('custom_prompt', prompt.trim());

      const response = await authenticatedFetch(API_URLS.GENERATE_REFERENCE_IMAGE_CONTENT_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Failed to generate reference image';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.data?.generated_images?.[0]?.image_data) {
        const generatedImage = data.data.generated_images[0].image_data;
        setReferenceProgress(100);
        
        // Store the generated image and navigate to content page
        localStorage.setItem('generatedImage', generatedImage);
        toast.success('Image generated successfully!');
        
        // Navigate to content page after a brief delay
        setTimeout(() => {
          router.push(`/dashboard/create/content?type=${type}&media=${media}&platform=${platform}&postType=${encodeURIComponent(postType)}`);
        }, 1000);
      } else {
        throw new Error('No image data in response');
      }
    } catch (error) {
      console.error('Error generating reference image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate reference image';
      toast.error(errorMessage);
    } finally {
      clearInterval(progressInterval);
      setIsGeneratingReference(false);
    }
  };

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    
    setIsEnhancing(true);
    setShowEnhanced(false);
    setAnimationStep(0);
    
    try {
      const token = getToken();
      if (!token) {
        toast.error('Authentication required');
        setIsEnhancing(false);
        return;
      }

      // Build the URL with the prompt as a query parameter
      const url = `${API_URLS.ENHANCE_PROMPT_URL}?prompt=${encodeURIComponent(prompt)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          // Clear authentication and redirect to login
          logout();
          return;
        }
        
        // Show the message field as the primary error message for other errors
        const errorMessage = errorData.message || 'Failed to enhance prompt';
        toast.error(errorMessage);
        setIsEnhancing(false);
        return;
      }

      const data = await response.json();
      
      if (data.data?.prompt) {
        const enhancedPrompt = data.data.prompt;
        
        setEnhancedText(enhancedPrompt);
        setEditablePrompt(prompt); // Initialize editable prompt with the original
        setEditableEnhancedPrompt(enhancedPrompt); // Initialize editable enhanced prompt
        setIsEnhancing(false);
        setShowEnhanced(true);
        
        // Increment credits used
        setCreditsUsed(prev => prev + 1);
        
        // Save the prompt and enhanced text to state
        const newSavedPrompt = {
          prompt: prompt,
          enhanced: enhancedPrompt,
          timestamp: new Date().toISOString()
        };
        setSavedPrompts(prev => [newSavedPrompt, ...prev.slice(0, 4)]); // Keep last 5 prompts
        
        // Set the newly generated prompt as selected
        setSelectedPromptIndex(0);
        
        // Start animation sequence
        setTimeout(() => setAnimationStep(1), 100);
        setTimeout(() => setAnimationStep(2), 300);
        setTimeout(() => setAnimationStep(3), 500);
        
        toast.success('Prompt enhanced successfully!');
      } else {
        toast.error('No enhanced prompt returned from server');
        setIsEnhancing(false);
      }
    } catch (error) {
      console.error('Enhance prompt error:', error);
      toast.error('Network or server error');
      setIsEnhancing(false);
    }
  };

  const handleContinue = () => {
    // Use the selected prompt's data
    const selectedPrompt = savedPrompts[selectedPromptIndex];
    
    // Use the editable prompts if they have been modified, otherwise use the originals
    const finalPrompt = editablePrompt.trim() || selectedPrompt.prompt;
    const finalEnhancedPrompt = editableEnhancedPrompt.trim() || selectedPrompt.enhanced;
    
    // Store the final (potentially edited) prompts
    localStorage.setItem('selectedEnhancedPrompt', finalEnhancedPrompt);
    localStorage.setItem('selectedOriginalPrompt', finalPrompt);
    
    // Navigate directly to content page with auto-generate flag to skip content generation
    router.push(
      `/dashboard/create/content?type=${type}&media=${media}&platform=${platform}&postType=${postType}&autoGenerate=true`
    );
  };

  const loadSavedPrompt = (savedPrompt: {prompt: string, enhanced: string, timestamp: string}, index: number) => {
    setPrompt(savedPrompt.prompt);
    setEnhancedText(savedPrompt.enhanced);
    setEditablePrompt(savedPrompt.prompt); // Initialize editable prompt with the original
    setEditableEnhancedPrompt(savedPrompt.enhanced); // Initialize editable enhanced prompt
    setSelectedPromptIndex(index);
    setShowEnhanced(true);
    setAnimationStep(3); // Skip to final animation step since content is already loaded
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-disoriti-primary/10 to-disoriti-accent/10 blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-r from-disoriti-accent/10 to-disoriti-primary/10 blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-gradient-to-r from-disoriti-primary/5 to-disoriti-accent/5 blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
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
            <BreadcrumbPage>Image Prompt</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Heading */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div 
            className="p-3 rounded-full bg-gradient-to-r from-disoriti-primary/20 to-disoriti-accent/20"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-8 w-8 text-disoriti-primary" />
          </motion.div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight animate-glow">
          {wantsReference === null ? "Choose Your Approach" : 
           wantsReference ? "Generate from Reference Image" : "Create Image Generation Prompt"}
        </h1>
        <p className="text-disoriti-primary/80 max-w-3xl mx-auto text-lg">
          {wantsReference === null 
            ? "Would you like to use a reference image to guide the generation, or create from a text prompt?"
            : wantsReference 
            ? "Upload your reference image and describe what you want. We'll generate a new image based on your reference and prompt."
            : "Describe the scene, style and mood. We'll enhance it into a detailed prompt to generate your perfect visual."
          }
        </p>
        
        {/* Credits Counter */}
        <div className="flex justify-center mt-4">
          <div className="bg-gradient-to-r from-disoriti-primary/10 to-disoriti-accent/10 border border-disoriti-primary/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-disoriti-primary animate-pulse"></div>
                <span className="text-sm font-medium text-disoriti-primary">Credits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-disoriti-primary">{maxCredits - creditsUsed}</span>
                <span className="text-sm text-muted-foreground">/ {maxCredits}</span>
              </div>
              <div className="w-16 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--secondary)' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${((maxCredits - creditsUsed) / maxCredits) * 100}%`,
                    backgroundColor: 'var(--primary)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-4 bg-background/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-glow">
        {wantsReference === null ? (
          // Choice Section
          <div className="space-y-6">
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-primary/20 text-primary/90 bg-primary/5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              Choose your generation method
            </div>
            <div className="flex gap-6 justify-center">
              <motion.button
                onClick={() => setWantsReference(true)}
                className="flex-1 max-w-sm p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-background to-muted/20 hover:border-disoriti-primary/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center space-y-4">
                  <div className="relative">
                    <span className="absolute inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-disoriti-primary/30 to-disoriti-accent/30 blur-xl animate-pulse" />
                    <ImageIcon className="h-10 w-10 text-disoriti-primary relative z-10 mx-auto" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Use Reference Image</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload an image to guide the style, composition, and visual elements
                    </p>
                  </div>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => setWantsReference(false)}
                className="flex-1 max-w-sm p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-background to-muted/20 hover:border-disoriti-primary/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center space-y-4">
                  <div className="relative">
                    <span className="absolute inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-disoriti-primary/30 to-disoriti-accent/30 blur-xl animate-pulse" />
                    <Wand2 className="h-10 w-10 text-disoriti-primary relative z-10 mx-auto" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Text Prompt</h3>
                    <p className="text-sm text-muted-foreground">
                      Describe what you want and we'll enhance it into a detailed prompt
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        ) : wantsReference ? (
          // Reference Image Flow
          <div className="space-y-6">
            {/* Reference Image Upload */}
            {!referenceImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="mb-6 inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-primary/20 text-primary/90 bg-primary/5">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Upload your reference image
                </div>
                <Card className="shadow-lg border border-white/10 bg-gradient-to-br from-background to-muted/20">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <span className="absolute inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-disoriti-primary/30 to-disoriti-accent/30 blur-xl animate-pulse" />
                        <ImageIcon className="h-10 w-10 text-disoriti-primary relative z-10" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Upload Reference Image</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Choose an image that represents the style, composition, or elements you want in your final image.
                        </p>
                        <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-accent/30 px-6 py-3 text-sm font-medium transition hover:scale-105 bg-gradient-to-r from-disoriti-primary/10 to-disoriti-accent/10 hover:from-disoriti-primary/20 hover:to-disoriti-accent/20">
                          Choose Image
                          <input type="file" accept="image/*" className="hidden" onChange={handleReferenceUpload} />
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Reference Image Preview */}
            {referencePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="mb-6 inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-primary/20 text-primary/90 bg-primary/5">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Reference image uploaded
                </div>
                <Card className="shadow-lg border border-white/10 bg-gradient-to-br from-background to-muted/20">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <img 
                          src={referencePreview} 
                          alt="Reference" 
                          className="w-full h-48 object-cover rounded-lg border border-white/10"
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        {!hasReference && (
                          <div>
                            <Label htmlFor="reference-prompt" className="text-sm font-medium">
                              Describe what you want to generate
                            </Label>
                            <Textarea
                              id="reference-prompt"
                              placeholder="e.g., Create a similar style but with different colors and composition..."
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              className="min-h-[120px] resize-none border-2 focus:border-disoriti-primary/50 focus:ring-disoriti-primary/20 mt-2"
                              disabled={isGeneratingReference}
                            />
                          </div>
                        )}
                        <div className="flex justify-center">
                          <Button 
                            onClick={handleGenerateReference} 
                            disabled={isGeneratingReference || (!hasReference && !prompt.trim())}
                            className="bg-gradient-to-r from-disoriti-primary to-disoriti-accent hover:from-disoriti-primary/90 hover:to-disoriti-accent/90 hover:text-black text-white disabled:opacity-50 disabled:cursor-not-allowed px-6"
                            size="default"
                          >
                            {isGeneratingReference ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating from Reference...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate from Reference
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        ) : (
          // Regular Prompt Flow
          !showEnhanced ? (
            // Input Section
            <Card className="shadow-lg border border-white/10 bg-gradient-to-br from-background to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-disoriti-primary" />
                  Describe Your Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-3 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-sm font-medium">
                    What do you want in your image?
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g., A modern fitness app interface showing workout tracking, progress charts, and motivational elements. Clean design with vibrant colors, showing a person using the app on their phone..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[96px] resize-none border-2 focus:border-disoriti-primary/50 focus:ring-disoriti-primary/20"
                    disabled={isEnhancing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Be as detailed as possible about the visual elements you want. Include style, colors, 
                    composition, mood, and any specific objects or scenes you'd like to see.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleEnhance} 
                    disabled={!prompt.trim() || isEnhancing || creditsUsed >= maxCredits}
                    className="bg-gradient-to-r from-disoriti-primary to-disoriti-accent hover:from-disoriti-primary/90 hover:to-disoriti-accent/90 hover:text-black text-white disabled:opacity-50 disabled:cursor-not-allowed px-6"
                    size="default"
                  >
                    {isEnhancing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Image Prompt...
                      </>
                    ) : creditsUsed >= maxCredits ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        No Credits Left
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Image Prompt ({maxCredits - creditsUsed} left)
                      </>
                    )}
                  </Button>
                </div>

                             {/* Credits Warning */}
               {creditsUsed >= maxCredits && (
                 <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                     <p className="text-sm text-orange-700 dark:text-orange-300">
                       You've used all your credits for this session. You can still view and use your previously generated prompts.
                     </p>
                   </div>
                 </div>
               )}

               {/* Saved Prompts Section */}
               {savedPrompts.length > 0 && (
                 <div className="mt-6 pt-6 border-t border-border/50">
                   <h3 className="text-sm font-medium mb-3 text-muted-foreground">Recent Image Prompts</h3>
                  <div className="space-y-2">
                    {savedPrompts.map((savedPrompt, index) => (
                                             <div 
                         key={index}
                         className="p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                         onClick={() => loadSavedPrompt(savedPrompt, index)}
                       >
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium line-clamp-1">{savedPrompt.prompt}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(savedPrompt.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {savedPrompt.enhanced}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          ) : (
          // Enhanced Result Section
          <div className="space-y-4">
                                      {/* Original Prompt */}
            <Card className="shadow-lg border border-white/10 bg-gradient-to-br from-background to-muted/20">
               <CardHeader>
                 <CardTitle className="text-lg">Your Image Description</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2">
                   <Textarea
                     value={editablePrompt}
                     onChange={(e) => setEditablePrompt(e.target.value)}
                     className="min-h-[100px] resize-none border-2 focus:border-disoriti-primary/50 focus:ring-disoriti-primary/20"
                     placeholder="Edit your image description..."
                   />
                   <p className="text-xs text-muted-foreground">
                     You can edit your original description here. The enhanced prompt below will remain the same.
                   </p>
                 </div>
               </CardContent>
             </Card>

             {/* Enhanced Content */}
            <Card className="shadow-lg border border-disoriti-primary/20 bg-gradient-to-br from-disoriti-primary/5 to-disoriti-accent/5">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-disoriti-primary">
                   <Sparkles className="h-5 w-5" />
                   Generated Image Prompt
                   {savedPrompts.length > 1 && (
                     <span className="text-sm font-normal text-muted-foreground ml-2">
                       (Selected: {selectedPromptIndex + 1} of {savedPrompts.length})
                     </span>
                   )}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2">
                   <Textarea
                     value={editableEnhancedPrompt}
                     onChange={(e) => setEditableEnhancedPrompt(e.target.value)}
                     className="min-h-[200px] resize-none border-2 focus:border-disoriti-primary/50 focus:ring-disoriti-primary/20"
                     placeholder="Edit the generated image prompt..."
                   />
                   <p className="text-xs text-muted-foreground">
                     You can edit the AI-generated prompt to fine-tune it to your exact needs.
                   </p>
                 </div>
               </CardContent>
             </Card>

                         {/* Action Buttons */}
             <div className="flex justify-center">
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setShowEnhanced(false);
                   setEnhancedText("");
                   setAnimationStep(0);
                 }}
                 className="flex items-center gap-2 hover:text-foreground"
               >
                 <Wand2 className="w-4 h-4" />
                 Generate New Prompt
               </Button>
             </div>

                                           {/* Saved Prompts Section - Show when enhanced content is displayed */}
               {savedPrompts.length > 1 && (
                 <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
                   <CardHeader>
                     <CardTitle className="text-lg">Choose Image Prompt</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-3">
                       {savedPrompts.map((savedPrompt, index) => (
                         <div 
                           key={index}
                           className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-200 ${
                             index === selectedPromptIndex 
                               ? 'bg-muted/50 border-2' 
                               : 'bg-muted/30 border border-border/30'
                           }`}
                           style={{
                             borderColor: index === selectedPromptIndex ? 'var(--accent)' : undefined
                           }}
                           onClick={() => loadSavedPrompt(savedPrompt, index)}
                         >
                         <div className="flex justify-between items-start mb-2">
                           <p className="text-sm font-medium line-clamp-1">{savedPrompt.prompt}</p>
                           <span className="text-xs text-muted-foreground">
                             {new Date(savedPrompt.timestamp).toLocaleDateString()}
                           </span>
                         </div>
                         <p className="text-xs text-muted-foreground line-clamp-2">
                           {savedPrompt.enhanced}
                         </p>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             )}
          </div>
        ))}
      </div>

      {/* Example Vision Layout Preview (only renders if layout present) */}
      {visionLayout && sceneDigest && (
        <div className="max-w-3xl mx-auto">
          <VisionLayoutRenderer
            imageUrl={imageUrl}
            layout={visionLayout}
            scene={sceneDigest}
            showSafeArea
            debugOutlineOverflow
            className="w-full"
          />
        </div>
      )}

      {/* Navigation */}
      <NavigationButtons
        onPrevious={() => {
          if (wantsReference !== null) {
            setWantsReference(null);
          } else {
            router.back();
          }
        }}
        onNext={wantsReference === null ? undefined :
          wantsReference ? 
            undefined : // Auto-navigate after generation, no manual next button needed
            handleContinue
        }
        disablePrevious={false}
        disableNext={wantsReference === null ? true : 
          wantsReference ? true : // Disable next button for reference flow (auto-navigates after generation)
          !showEnhanced}
        nextLabel={wantsReference === null ? "Choose an option" :
          wantsReference ? 
            (isGeneratingReference ? "Generating..." : "Generate Image to Continue") : 
            "Continue →"
        }
        enableClickProgress
      />
    </div>
  );
}

export default function EnhancePromptPage() {
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
      <EnhancePromptPageInner />
    </Suspense>
  );
} 