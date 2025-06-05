import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function AnalyticsCard({
  title,
  value,
  description,
  trend,
  className,
}: AnalyticsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-disoriti-primary/20 bg-disoriti-secondary p-6 shadow-lg transition-all duration-300",
        "hover:border-disoriti-primary/40 hover:shadow-[0_0_15px_rgba(0,255,169,0.3)]",
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-disoriti-primary/0 via-disoriti-primary/10 to-disoriti-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-disoriti-primary/0 via-disoriti-primary/20 to-disoriti-accent/0 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-100 group-hover:blur-2xl" />
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-disoriti-primary/80 transition-colors duration-300 group-hover:text-disoriti-primary">
          {title}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-3xl font-semibold text-white transition-colors duration-300 group-hover:text-disoriti-primary/90">
            {value}
          </p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.isPositive ? "text-green-400" : "text-red-400"
            )}>
              {trend.isPositive ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-disoriti-primary/60 transition-colors duration-300 group-hover:text-disoriti-primary/80">
            {description}
          </p>
        )}
      </div>
    </div>
  );
} 