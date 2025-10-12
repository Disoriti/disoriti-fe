import React, { ReactNode, useCallback, useRef, useState } from "react";

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  disablePrevious?: boolean;
  disableNext?: boolean;
  isNextLoading?: boolean;
  className?: string;
  nextProgress?: number; // 0-100 optional in-button gradient fill
  enableClickProgress?: boolean; // quick fill animation on click for short actions
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  previousLabel = "← Previous",
  nextLabel = "Next →",
  disablePrevious = false,
  disableNext = false,
  isNextLoading = false,
  className = "",
  nextProgress,
  enableClickProgress,
}) => {
  const [internalProgress, setInternalProgress] = useState<number | undefined>(undefined);
  const rafRef = useRef<number | null>(null);

  const startInternalProgress = useCallback(() => {
    if (!enableClickProgress || typeof nextProgress === 'number') return;
    setInternalProgress(0);
    let p = 0;
    const tick = () => {
      p = Math.min(100, p + 5);
      setInternalProgress(p);
      if (p < 100 && rafRef.current !== null) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // reset shortly after completing
        setTimeout(() => setInternalProgress(undefined), 250);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [enableClickProgress, nextProgress]);

  const handleNextClick = useCallback(() => {
    if (disableNext || isNextLoading) return;
    startInternalProgress();
    onNext?.();
  }, [disableNext, isNextLoading, onNext, startInternalProgress]);

  const effectiveProgress = typeof nextProgress === 'number' ? nextProgress : internalProgress;

  return (
    <div className={`flex flex-row gap-6 justify-center mt-8 ${className}`}>
      <button
        type="button"
        className={`group relative inline-flex items-center justify-center px-8 py-3 rounded-xl border border-white/20 text-white/50 bg-disoriti-primary/5 font-medium transition-all duration-300
          hover:border-disoriti-primary/50 hover:bg-disoriti-primary/20 hover:text-white hover:scale-105
          ${disablePrevious ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onClick={onPrevious}
        disabled={disablePrevious}
      >
        {previousLabel}
      </button>
      <button
        type="button"
        className={`group relative inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg overflow-hidden ${
          disableNext
            ? "bg-disoriti-accent/10 text-white/50 border border-accent/20 opacity-50 cursor-not-allowed"
            : "text-white border border-accent/20 hover:shadow-accent/40 hover:scale-105"
        }`}
        onClick={handleNextClick}
        disabled={disableNext || isNextLoading}
      >
        {/* In-button gradient progress fill */}
        {typeof effectiveProgress === 'number' && effectiveProgress >= 0 && (
          <span
            className="absolute inset-y-0 left-0"
            style={{
              width: `${Math.max(0, Math.min(100, effectiveProgress))}%`,
              background: "linear-gradient(90deg, var(--primary), var(--accent))",
              opacity: 0.85,
              zIndex: 0,
            }}
          />
        )}
        {/* Content */}
        <span className="relative z-10">
        {isNextLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            Generating...
          </span>
        ) : (
          nextLabel
        )}
        </span>
      </button>
    </div>
  );
};

export default NavigationButtons; 