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
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import StepProgress from "@/components/ui/step-progress";
import NavigationButtons from "@/components/navigation-buttons";

export default function CreatePage() {
  const [selected, setSelected] = useState<"ad" | "social">();
  const router = useRouter();

  return (
    <div className="space-y-8 p-6 animate-fade-in">
      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full">
        <StepProgress currentStep={1} totalSteps={6} />
      </div>
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
      <h1 className="text-3xl md:text-4xl font-bold text-disoriti-primary mb-4 text-center tracking-tight animate-glow">
        What do you want to create today?
      </h1>
      <p className="text-center text-disoriti-primary/80 max-w-3xl mx-auto text-lg">
        Pick a starting point. You can change your mind later — we’ll guide you step by step.
      </p>

      {/* Main Selection + Navigation Buttons */}
      <div className="flex flex-col items-center gap-8">
        {/* Option Cards */}
        <div className="flex gap-10 w-full justify-center">
          {([
            { key: "ad", title: "Ad", subtitle: "Promote your product or service" },
            { key: "social", title: "Social Media Post", subtitle: "Instagram, Facebook, TikTok..." },
          ] as const).map((opt) => (
            <motion.button
              key={opt.key}
              whileHover={{ scale: 1.04, rotate: 0.2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 ${
                selected === opt.key ? "border-secondary/80 ring-4 ring-primary/10" : "border-secondary/60"
              }`}
              onClick={() => setSelected(opt.key as typeof selected)}
              type="button"
            >
              <span className="mb-2">{opt.title}</span>
              <span className="text-base font-normal text-disoriti-primary/70">
                {opt.subtitle}
              </span>
              {opt.key === "social" && (
                <div className="flex gap-3 mt-4">
                  <Instagram className="h-6 w-6 text-pink-500" />
                  <Facebook className="h-6 w-6 text-blue-500" />
                  <Music2 className="h-6 w-6 text-black dark:text-white" />
                </div>
              )}
            </motion.button>
          ))}
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
