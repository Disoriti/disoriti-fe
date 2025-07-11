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
import { Instagram, Facebook, Music2 } from "lucide-react";
import { useRouter } from "next/navigation";
import NavigationButtons from "@/components/navigation-buttons";

export default function CreatePage() {
  const [selected, setSelected] = useState<"ad" | "social">();
  const router = useRouter();

  return (
    <div className="space-y-8 p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">| Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Heading */}
      <h1 className="text-3xl md:text-3xl font-bold text-disoriti-primary mb-8 text-center tracking-tight animate-glow">
        What do you want to create Today?
      </h1>

      {/* Main Selection + Navigation Buttons */}
      <div className="flex flex-col items-center gap-8">
        {/* Option Cards */}
        <div className="flex gap-10 w-full justify-center">
          <button
            className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 ${
              selected === "ad"
                ? "border-secondary/80 ring-4 ring-primary/10 scale-105"
                : "border-secondary/60"
            }`}
            onClick={() => setSelected("ad")}
            type="button"
          >
            <span className="mb-2">Ad</span>
            <span className="text-base font-normal text-disoriti-primary/70">
              Promote your product or service
            </span>
          </button>

          <button
            className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 ${
              selected === "social"
                ? "border-secondary/80 ring-4 ring-primary/10 scale-105"
                : "border-secondary/60"
            }`}
            onClick={() => setSelected("social")}
            type="button"
          >
            <span className="mb-4">Social Media Post</span>
            <div className="flex gap-3 mt-2">
              <Instagram className="h-6 w-6 text-pink-500" />
              <Facebook className="h-6 w-6 text-blue-500" />
              <Music2 className="h-6 w-6 text-black dark:text-white" />
            </div>
          </button>
        </div>

        <NavigationButtons
          onPrevious={() => {}}
          onNext={() => {
            if (selected) {
              router.push(`/dashboard/create/media?type=${selected}`);
            }
          }}
          disablePrevious={true}
          disableNext={!selected}
        />
      </div>
    </div>
  );
}
