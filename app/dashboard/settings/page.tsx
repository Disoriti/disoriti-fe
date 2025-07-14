"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Image as ImageIcon, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const brandNiches = [
  "Fashion",
  "Food & Beverage",
  "Technology",
  "Health & Wellness",
  "Education",
  "Travel",
  "Beauty",
  "Finance",
  "Other",
];

function LogoDropZone({ logo, onLogoChange, onClear }: { logo: string | null, onLogoChange: (file: File) => void, onClear: () => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onLogoChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onLogoChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer group ${
          isDragOver ? 'border-primary bg-primary/5 scale-105' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={e => { e.preventDefault(); setIsDragOver(false); }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        {!logo ? (
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className={`p-3 rounded-full transition-colors ${isDragOver ? 'bg-primary/10' : 'bg-muted'}`}>
              <ImageIcon className={`w-6 h-6 transition-colors ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-medium transition-colors ${isDragOver ? 'text-primary' : 'text-foreground'}`}>{isDragOver ? 'Drop your logo here' : 'Click to upload or drag and drop'}</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 5MB</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <img src={logo} alt="Brand Logo" className="w-20 h-20 object-contain border rounded bg-white shadow" />
            <Button size="sm" variant="ghost" className="text-destructive" onClick={e => { e.stopPropagation(); onClear(); }}>
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  // Personal info state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Brand info state
  const [brandName, setBrandName] = useState("");
  const [brandNiche, setBrandNiche] = useState("");
  const [brandNicheOther, setBrandNicheOther] = useState("");
  const [brandLogo, setBrandLogo] = useState<string | null>(null);
  const [brandColors, setBrandColors] = useState<string[]>(["#3b82f6", "#ef4444", "#10b981"]);

  const handleLogoChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => setBrandLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleColorChange = (idx: number, color: string) => {
    setBrandColors((prev) => prev.map((c, i) => (i === idx ? color : c)));
  };

  const handleAddColor = () => {
    setBrandColors((prev) => [...prev, "#000000"]);
  };

  const handleRemoveColor = (idx: number) => {
    setBrandColors((prev) => prev.filter((_, i) => i !== idx));
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
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Change Password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" />
            </div>
            <Button className="w-full mt-2">Save Personal Info</Button>
          </CardContent>
        </Card>

        {/* Brand Information */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <CardTitle className="text-lg">Brand Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input id="brand-name" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Your brand name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-niche">Brand Niche</Label>
              <Select value={brandNiche} onValueChange={setBrandNiche}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a niche" />
                </SelectTrigger>
                <SelectContent>
                  {brandNiches.map((niche) => (
                    <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {brandNiche === "Other" && (
                <Input className="mt-2" value={brandNicheOther} onChange={e => setBrandNicheOther(e.target.value)} placeholder="Please specify your niche" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Brand Logo</Label>
              <LogoDropZone logo={brandLogo} onLogoChange={handleLogoChange} onClear={() => setBrandLogo(null)} />
            </div>
            <div className="space-y-2">
              <Label>Brand Color Palette</Label>
              <div className="flex md:grid md:grid-cols-4 gap-2 mt-4 ml-2 overflow-x-auto pb-2">
                {brandColors.map((color, idx) => (
                  <div
                    key={idx}
                    className="relative group flex flex-col items-center w-16 min-w-[4rem]"
                  >
                    <div className="w-12 h-12 rounded-xl shadow border-2 border-border flex items-center justify-center transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/60">
                      <input
                        aria-label={`Choose color ${idx + 1}`}
                        type="color"
                        value={color}
                        onChange={e => handleColorChange(idx, e.target.value)}
                        className="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent p-0 focus:outline-none"
                        style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
                      />
                      {brandColors.length > 1 && (
                        <button
                          type="button"
                          aria-label="Remove color"
                          onClick={() => handleRemoveColor(idx)}
                          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-border shadow rounded-full p-1 text-destructive hover:bg-destructive/10 focus:opacity-100 focus:outline-none"
                          tabIndex={0}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <span className="text-xs mt-1 font-mono text-muted-foreground select-all">{color.toUpperCase()}</span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="w-16 min-w-[4rem] h-16 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl shadow bg-muted/40 hover:bg-muted/70 transition-all duration-200 focus:ring-2 focus:ring-primary/60 group"
                  aria-label="Add color"
                >
                  <Palette className="w-5 h-5 text-muted-foreground group-hover:text-primary mb-1 transition-colors" />
                  <span className="text-xs text-muted-foreground">Add</span>
                </button>
              </div>
            </div>
            <Button className="w-full mt-2">Save Brand Info</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 