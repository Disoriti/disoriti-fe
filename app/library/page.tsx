"use client";
import { useEffect, useState } from "react";

// Example ad type
interface Ad {
  id: string;
  media: "image" | "video";
  previewUrl: string;
  heading: string;
  platform: string;
  postType: string;
  createdAt: string;
}

export default function LibraryPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call
    // Simulate loading
    setTimeout(() => {
      setAds([]); // Replace with fetched ads
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-disoriti-primary">Your Ad Library</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-disoriti-primary" />
        </div>
      ) : ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-disoriti-primary/70">
          <span className="text-5xl mb-4">📁</span>
          <p className="text-xl font-semibold mb-2">No ads yet!</p>
          <p className="text-base">Start creating to see your magic here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 rounded-2xl shadow-lg p-4 flex flex-col">
              <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden bg-black/10">
                {ad.media === "video" ? (
                  <video src={ad.previewUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={ad.previewUrl} alt={ad.heading} className="w-full h-full object-cover" />
                )}
              </div>
              <h2 className="text-xl font-bold mb-2">{ad.heading}</h2>
              <div className="flex items-center gap-2 text-sm text-disoriti-primary/70 mb-2">
                <span>{ad.platform}</span>
                <span>•</span>
                <span>{ad.postType}</span>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs text-disoriti-primary/50">{new Date(ad.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1 rounded bg-disoriti-primary/10 hover:bg-disoriti-primary/20">View</button>
                  <button className="text-xs px-3 py-1 rounded bg-disoriti-accent/10 hover:bg-disoriti-accent/20">Download</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 