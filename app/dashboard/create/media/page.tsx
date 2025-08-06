"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Image, Video } from "lucide-react";
import NavigationButtons from "@/components/navigation-buttons";

function MediaPageInner() {
  const [selected, setSelected] = useState<"image" | "video">();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

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
            <BreadcrumbPage>Media Type</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Heading */}
      <h1 className="text-3xl md:text-3xl font-bold text-disoriti-primary mb-8 text-center tracking-tight animate-glow">
        Choose your media type
      </h1>

      {/* Main Selection + Navigation Buttons */}
      <div className="flex flex-col items-center gap-8">
        {/* Option Cards */}
        <div className="flex gap-10 w-full justify-center">
          <button
            className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 ${
              selected === "image"
                ? "border-secondary/80 ring-4 ring-primary/30 scale-105"
                : "border-secondary/60"
            }`}
            onClick={() => setSelected("image")}
            type="button"
          >
            <Image className="h-12 w-12 mb-4" />
            <span className="mb-2">Image</span>
            <span className="text-base font-normal text-disoriti-primary/70">
              Upload or create an image
            </span>
          </button>

          <div className="relative">
            <button
              className="flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-16 py-20 text-2xl font-bold w-[340px] h-56 border-secondary/60 opacity-60 cursor-not-allowed"
              disabled
              type="button"
            >
              <Video className="h-12 w-12 mb-4" />
              <span className="mb-2">Video</span>
              <span className="text-base font-normal text-disoriti-primary/70">
                Upload or create a video
              </span>
            </button>
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
              <div className="bg-disoriti-primary text-white px-4 py-2 rounded-lg font-semibold text-sm">
                Coming Soon!
              </div>
            </div>
          </div>
        </div>

        <NavigationButtons
          onPrevious={() => router.back()}
          onNext={() => {
            if (selected) {
              router.push(`/dashboard/create/upload?type=${type}&media=${selected}`);
            }
          }}
          disablePrevious={false}
          disableNext={!selected}
        />
      </div>
    </div>
  );
}

export default function MediaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MediaPageInner />
    </Suspense>
  );
} 