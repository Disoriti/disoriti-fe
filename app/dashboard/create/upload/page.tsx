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
import { Facebook, Instagram, Linkedin, Music2 } from "lucide-react";
import NavigationButtons from "@/components/navigation-buttons";
import { PostType, socialMediaTypes } from "@/app/dashboard/create/upload/types";



export default function UploadPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const media = searchParams.get("media");

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return <Facebook className="h-12 w-12 mb-4" />;
      case "Instagram":
        return <Instagram className="h-12 w-12 mb-4" />;
      case "TikTok":
        return <Music2 className="h-12 w-12 mb-4" />;
      case "LinkedIn":
        return <Linkedin className="h-12 w-12 mb-4" />;
      default:
        return null;
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
            <BreadcrumbPage>Post Type</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Heading */}
      <h1 className="text-3xl md:text-3xl font-bold text-disoriti-primary mb-8 text-center tracking-tight animate-glow">
        {!selectedPlatform ? "Choose your platform" : "Select post type"}
      </h1>

      {/* Main Selection + Navigation Buttons */}
      <div className="flex flex-col items-center gap-8">
        {/* Option Cards */}
        <div className="flex flex-wrap gap-6 w-full justify-center">
          {!selectedPlatform ? (
            // Platform Selection
            socialMediaTypes.map((platform) => (
              <button
                key={platform.platform}
                className="flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-8 py-12 text-xl font-bold w-[280px] hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40"
                onClick={() => setSelectedPlatform(platform.platform)}
                type="button"
              >
                {getPlatformIcon(platform.platform)}
                <span>{platform.platform}</span>
              </button>
            ))
          ) : (
            // Post Type Selection
            socialMediaTypes
              .find((p) => p.platform === selectedPlatform)
              ?.posts.map((post) => (
                <button
                  key={post.type}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-8 py-12 text-lg font-bold w-[280px] hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 ${
                    selectedPostType?.type === post.type
                      ? "border-secondary/80 ring-4 ring-primary/30 scale-105"
                      : "border-secondary/60"
                  }`}
                  onClick={() => setSelectedPostType(post)}
                  type="button"
                >
                  <span className="mb-2">{post.type}</span>
                  <span className="text-sm font-normal text-disoriti-primary/70">
                    {post.size} ({post.aspect_ratio})
                  </span>
                </button>
              ))
          )}
        </div>

        <NavigationButtons
          onPrevious={() => {
            if (selectedPlatform) {
              setSelectedPlatform(null);
              setSelectedPostType(null);
            } else {
              router.back();
            }
          }}
          onNext={() => {
            if (selectedPlatform && selectedPostType) {
              router.push(
                `/dashboard/create/editor?type=${type}&media=${media}&platform=${selectedPlatform}&postType=${encodeURIComponent(selectedPostType.type)}`
              );
            }
          }}
          disablePrevious={false}
          disableNext={!(selectedPlatform && selectedPostType)}
        />
      </div>
    </div>
  );
} 