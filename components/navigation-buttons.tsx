import React from "react";

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  disablePrevious?: boolean;
  disableNext?: boolean;
  isNextLoading?: boolean;
  className?: string;
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
}) => {
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
        className={`group relative inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
          disableNext
            ? "bg-disoriti-accent/10 text-white/50 border border-accent/20 opacity-50 cursor-not-allowed"
            : "text-white border border-accent/20 hover:shadow-accent/40 hover:scale-105"
        }`}
        onClick={onNext}
        disabled={disableNext || isNextLoading}
      >
        {isNextLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            Generating...
          </span>
        ) : (
          nextLabel
        )}
      </button>
    </div>
  );
};

export default NavigationButtons; 