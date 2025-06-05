import { useEffect, useState } from "react";

const phrases = [
  "Cooking up your ad magic…",
  "Adding a pinch of creativity…",
  "Designing something awesome…",
  "Almost there!",
  "Just a moment, your ad is being generated…"
];

export default function AdGenerationLoader() {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIdx((idx) => (idx + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 z-50">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-disoriti-primary mb-8" />
      <h2 className="text-2xl font-bold text-white mb-4 animate-glow">{phrases[phraseIdx]}</h2>
      <p className="text-disoriti-primary/70">Please wait while we generate your ad…</p>
    </div>
  );
} 