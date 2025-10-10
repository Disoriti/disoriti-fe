"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavigationButtons from "@/components/navigation-buttons";
import { ImagePlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StepProgress from "@/components/ui/step-progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function ReferencePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const media = searchParams.get("media") || "";

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showBgRemoved, setShowBgRemoved] = useState<boolean>(false);
  const [isBgProcessing, setIsBgProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith("image/")) setFile(dropped);
  };

  const onBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("image/")) setFile(f);
  };

  const handleToggleBgRemoved = (checked: boolean) => {
    setShowBgRemoved(checked);
    if (checked) {
      setIsBgProcessing(true);
      setTimeout(() => setIsBgProcessing(false), 1200);
    }
  };

  const progressValue = useMemo(() => 50, []);

  return (
    <div className="space-y-8 p-6 animate-fade-in">
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
            <BreadcrumbPage>Reference Image (optional)</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full">
        <StepProgress currentStep={3} totalSteps={6} />
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-disoriti-primary mb-3 text-center tracking-tight animate-glow">
        Add a reference image (optional)
      </h1>
      <p className="text-center text-disoriti-primary/80 max-w-3xl mx-auto text-lg">
        This helps guide composition, colors and visual style. You can skip this step — we’ll still create something great.
      </p>

      {/* Reference Upload Card */}
      <div className="flex justify-center">
        <div
          className="w-full max-w-3xl rounded-2xl border border-disoriti-primary/20 bg-gradient-to-br from-disoriti-primary/5 to-disoriti-accent/5 p-8 shadow-xl"
        >
          {previewUrl && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                In the backend, we remove the background for better layout blending. Preview it here.
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="bg-removed" className="text-sm">Show background removed</Label>
                <Switch id="bg-removed" checked={showBgRemoved} onCheckedChange={handleToggleBgRemoved} />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative"
              >
                {showBgRemoved ? (
                  <div className="w-full h-[360px] rounded-xl overflow-hidden border border-white/10 relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%)," +
                          "linear-gradient(-45deg, rgba(255,255,255,0.15) 25%, transparent 25%)," +
                          "linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.15) 75%)," +
                          "linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.15) 75%)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                        backgroundColor: "rgba(0,0,0,0.35)",
                      }}
                    />
                    <motion.img
                      src={previewUrl}
                      alt="Background removed preview"
                      className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
                      initial={{ y: 6, opacity: 0.9, filter: "drop-shadow(0 16px 18px rgba(0,0,0,0.35))" }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    {isBgProcessing && (
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.1, ease: "easeInOut" }}
                          />
                        </div>
                        <div className="mt-2 text-center text-xs text-muted-foreground">Removing background…</div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 text-[10px] uppercase tracking-wide bg-black/60 text-white px-2 py-1 rounded">
                      Simulated Preview
                    </div>
                  </div>
                ) : (
                  <motion.img
                    src={previewUrl}
                    alt="Reference preview"
                    className="w-full h-[360px] object-contain rounded-xl border border-white/10 bg-black/20"
                    initial={{ filter: "saturate(0.9) brightness(0.95)" }}
                    animate={{ filter: ["saturate(0.9) brightness(0.95)", "saturate(1) brightness(1)"] }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                {/* Subtle scanning overlay */}
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.35, 0] }}
                  transition={{ repeat: Infinity, duration: 3.2 }}
                  style={{
                    background: "linear-gradient(180deg, transparent, rgba(0,255,169,0.08), transparent)",
                    backgroundSize: "100% 200%",
                    backgroundPositionY: "-100%",
                  }}
                />
                <button
                  type="button"
                  className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 p-2 text-white transition"
                  onClick={() => setFile(null)}
                  aria-label="Remove reference image"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="group relative overflow-hidden"
              >
                {/* Neon grid background */}
                <div className="absolute inset-0 bg-neon-grid opacity-20" />
                {/* Glow ring that responds to hover */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  initial={{ boxShadow: "0 0 0px rgba(0,255,169,0.0)" }}
                  whileHover={{ boxShadow: "0 0 30px rgba(0,255,169,0.25)" }}
                />
                <div
                  className="relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-disoriti-primary/30 bg-background/40 p-12 text-center transition group-hover:border-disoriti-primary/60"
                  onDrop={onDrop}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
                >
                  <span className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-disoriti-primary/30 to-disoriti-accent/30 blur-xl animate-pulse" />
                    <motion.div whileHover={{ rotate: 8 }} whileTap={{ scale: 0.95 }}>
                      <ImagePlus className="h-10 w-10 text-disoriti-primary drop-shadow-lg relative z-10" />
                    </motion.div>
                  </span>
                  <div>
                    <div className="text-lg font-semibold">Drag & drop image here</div>
                    <div className="text-sm text-disoriti-primary/70">or click to browse</div>
                  </div>
                  <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-lg border border-accent/30 px-4 py-2 text-sm font-medium transition hover:scale-105">
                    Choose Image
                    <input type="file" accept="image/*" className="hidden" onChange={onBrowse} />
                  </label>
                  <div className="text-xs text-muted-foreground">PNG, JPG up to ~5MB</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <NavigationButtons
        onPrevious={() => router.back()}
        onNext={() => {
          const params = new URLSearchParams({ type, media });
          router.push(`/dashboard/create/upload?${params.toString()}`);
        }}
        disablePrevious={false}
        disableNext={false}
        nextLabel={"Continue →"}
      />
      <div className="text-center text-sm text-muted-foreground -mt-6">You can skip this step</div>
    </div>
  );
}

export default function ReferencePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ReferencePageInner />
    </Suspense>
  );
}


