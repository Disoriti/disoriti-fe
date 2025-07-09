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
import { Settings, Plus, X } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import NavigationButtons from "@/components/navigation-buttons";

// Mock settings data - In real app, this would come from your settings store/API
const mockSettings = {
  brandName: "Disoriti",
  logo: "/logo.png",
  colorPalette: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
};

function EditorPageInner() {
  const [selectedOption, setSelectedOption] = useState<"import" | "new" | null>(null);
  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [colors, setColors] = useState<string[]>(["#FF6B6B", "#4ECDC4", "#45B7D1"]);
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);
  const [hexInput, setHexInput] = useState("");
  const [postHeading, setPostHeading] = useState("");
  const [postSubheading, setPostSubheading] = useState("");
  const [hasCTA, setHasCTA] = useState(false);
  const [ctaText, setCtaText] = useState("");
  const [extraText, setExtraText] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const media = searchParams.get("media");
  const platform = searchParams.get("platform");
  const postType = searchParams.get("postType");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleColorChange = (color: string, index: number) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length < 4) {
      setColors([...colors, "#FF6B6B"]);
    }
  };

  const removeColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);
    
    // Validate hex color format
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setColors([...colors, value]);
      setHexInput("");
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
            <BreadcrumbLink href={`/dashboard/create/upload?type=${type}&media=${media}`}>
              Post Type
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Heading */}
      <h1 className="text-3xl md:text-3xl font-bold text-disoriti-primary mb-8 text-center tracking-tight animate-glow">
        Configure your post settings
      </h1>

      {/* Main Selection + Navigation Buttons */}
      <div className="flex flex-col items-center gap-8">
        {!selectedOption ? (
          // Initial Options
          <div className="flex gap-10 w-full justify-center">
            <button
              className="flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40"
              onClick={() => setSelectedOption("import")}
              type="button"
            >
              <Settings className="h-12 w-12 mb-4" />
              <span className="mb-2">Import from Settings</span>
              <span className="text-base font-normal text-disoriti-primary/70">
                Use your saved brand settings
              </span>
            </button>

            <button
              className="flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xl bg-gradient-to-br from-disoriti-primary/10 to-disoriti-accent/10 px-16 py-20 text-2xl font-bold w-[340px] h-56 hover:border-disoriti-primary/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40"
              onClick={() => setSelectedOption("new")}
              type="button"
            >
              <Plus className="h-12 w-12 mb-4" />
              <span className="mb-2">Define New Settings</span>
              <span className="text-base font-normal text-disoriti-primary/70">
                Create custom settings for this post
              </span>
            </button>
          </div>
        ) : selectedOption === "import" ? (
          // Import Settings View
          <div className="w-full max-w-2xl bg-gradient-to-br from-disoriti-primary/5 to-disoriti-accent/5 p-8 rounded-2xl border border-disoriti-primary/20">
            <h2 className="text-2xl font-bold mb-6">Current Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Brand Name</label>
                <div className="p-3 bg-white/5 rounded-lg">{mockSettings.brandName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Logo</label>
                <div className="p-3 bg-white/5 rounded-lg">
                  <img src={mockSettings.logo} alt="Brand Logo" className="h-12" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color Palette</label>
                <div className="flex gap-3">
                  {mockSettings.colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-lg"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // New Settings Form
          <div className="w-full max-w-2xl bg-gradient-to-br from-disoriti-primary/5 to-disoriti-accent/5 p-8 rounded-2xl border border-disoriti-primary/20">
            <h2 className="text-2xl font-bold mb-6">New Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full p-3 bg-white/5 rounded-lg border border-disoriti-primary/20 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40"
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-disoriti-primary/10 rounded-lg cursor-pointer hover:bg-disoriti-primary/20 transition-colors"
                  >
                    Upload Logo
                  </label>
                  {logo && (
                    <span className="text-sm text-disoriti-primary/70">
                      {logo.name}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color Palette</label>
                <div className="space-y-4">
                  <div className="flex gap-3 mb-4">
                    {colors.map((color, index) => (
                      <div key={index} className="relative group">
                        <div
                          className="w-12 h-12 rounded-lg cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => setShowColorPicker(index)}
                        />
                        <button
                          onClick={() => removeColor(index)}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                        {showColorPicker === index && (
                          <div className="absolute z-10 mt-2">
                            <div
                              className="fixed inset-0"
                              onClick={() => setShowColorPicker(null)}
                            />
                            <HexColorPicker
                              color={color}
                              onChange={(color) => handleColorChange(color, index)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {colors.length < 4 && (
                      <button
                        onClick={addColor}
                        className="w-12 h-12 rounded-lg border-2 border-dashed border-disoriti-primary/20 flex items-center justify-center hover:border-disoriti-primary/40 transition-colors"
                      >
                        <Plus className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                  {colors.length < 4 && (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={hexInput}
                        onChange={handleHexInput}
                        placeholder="#RRGGBB"
                        className="w-32 p-2 bg-white/5 rounded-lg border border-disoriti-primary/20 focus:outline-none focus:ring-2 focus:ring-disoriti-primary/40 text-sm"
                        maxLength={7}
                      />
                      {/* <span className="text-sm text-disoriti-primary/70">
                        Enter hex color code
                      </span> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <NavigationButtons
          onPrevious={() => {
            if (selectedOption) {
              setSelectedOption(null);
            } else {
              router.back();
            }
          }}
          onNext={() => {
            if (selectedOption === "import") {
              router.push(
                `/dashboard/create/content?type=${type}&media=${media}&platform=${platform}&postType=${postType}&settings=imported`
              );
            } else if (selectedOption === "new") {
              router.push(
                `/dashboard/create/content?type=${type}&media=${media}&platform=${platform}&postType=${postType}&settings=new`
              );
            }
          }}
          disablePrevious={false}
          disableNext={!selectedOption}
        />
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorPageInner />
    </Suspense>
  );
} 