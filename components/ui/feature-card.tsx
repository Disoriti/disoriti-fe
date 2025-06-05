import { cn } from "@/lib/utils";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  className,
}: FeatureCardProps) {
  return (
    <Link href={href}>
        <div
        className={cn(
            "group relative overflow-hidden rounded-lg border border-[#00FFF5]/30",

            "p-6 shadow-lg backdrop-blur-sm transition-all duration-300",
            "hover:border-[#00FFF5]/50 hover:shadow-[0_0_20px_#00FFF5]",
            className
        )}
        >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-disoriti-primary/0 via-disoriti-primary/10 to-disoriti-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-disoriti-primary/0 via-disoriti-primary/20 to-disoriti-accent/0 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-100 group-hover:blur-2xl" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="mb-4 inline-flex rounded-lg bg-disoriti-primary/10 p-3 text-disoriti-primary transition-colors duration-300 group-hover:bg-disoriti-primary/20">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-disoriti-primary">
            {title}
          </h3>
          <p className="mt-2 text-sm text-disoriti-primary/60 transition-colors duration-300 group-hover:text-disoriti-primary/80">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
} 