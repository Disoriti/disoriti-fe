"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Image as ImageIcon, 
  X, 
  User, 
  Building2, 
  Settings, 
  Bell, 
  Shield, 
  Download,
  Zap,
  Save,
  Globe
} from "lucide-react";
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

const outputFormats = ["PNG", "JPG", "SVG", "PDF"];
const qualityLevels = ["Standard", "High", "Ultra"];
const defaultStyles = ["Modern", "Minimalist", "Bold", "Elegant", "Playful", "Professional"];

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
  const [brandDescription, setBrandDescription] = useState("");

  // Generation preferences
  const [defaultOutputFormat, setDefaultOutputFormat] = useState("PNG");
  const [defaultQuality, setDefaultQuality] = useState("High");
  const [defaultStyle, setDefaultStyle] = useState("Modern");
  const [autoEnhancePrompts, setAutoEnhancePrompts] = useState(true);
  const [autoSaveToLibrary, setAutoSaveToLibrary] = useState(true);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [generationComplete, setGenerationComplete] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);

  // Content preferences
  const [defaultPlatforms, setDefaultPlatforms] = useState<string[]>(["instagram"]);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [metadataIncluded, setMetadataIncluded] = useState(true);

  // Privacy & Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [dataRetention, setDataRetention] = useState("90");
  const [analyticsTracking, setAnalyticsTracking] = useState(true);

  // Export settings
  const [exportFormat, setExportFormat] = useState("PNG");
  const [exportQuality, setExportQuality] = useState("High");
  const [includeMetadata, setIncludeMetadata] = useState(true);

  const handleLogoChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => setBrandLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const togglePlatform = (platform: string) => {
    setDefaultPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
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

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Manage your account details and password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" />
            </div>
            <Button className="w-full">Save Personal Info</Button>
          </CardContent>
        </Card>

        {/* Brand Information */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <CardTitle>Brand Information</CardTitle>
            </div>
            <CardDescription>Configure your brand identity for content generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="brand-description">Brand Description</Label>
              <Textarea 
                id="brand-description" 
                value={brandDescription} 
                onChange={e => setBrandDescription(e.target.value)} 
                placeholder="Describe your brand, values, and target audience..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Brand Logo</Label>
              <LogoDropZone logo={brandLogo} onLogoChange={handleLogoChange} onClear={() => setBrandLogo(null)} />
            </div>
            <Button className="w-full">Save Brand Info</Button>
          </CardContent>
        </Card>

        {/* Generation Preferences */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle>Generation Preferences</CardTitle>
            </div>
            <CardDescription>Set default options for content generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Output Format</Label>
              <Select value={defaultOutputFormat} onValueChange={setDefaultOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map((format) => (
                    <SelectItem key={format} value={format}>{format}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Quality</Label>
              <Select value={defaultQuality} onValueChange={setDefaultQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qualityLevels.map((quality) => (
                    <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Style</Label>
              <Select value={defaultStyle} onValueChange={setDefaultStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {defaultStyles.map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-enhance Prompts</Label>
                <p className="text-xs text-muted-foreground">Automatically improve prompts before generation</p>
              </div>
              <Switch checked={autoEnhancePrompts} onCheckedChange={setAutoEnhancePrompts} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save to Library</Label>
                <p className="text-xs text-muted-foreground">Automatically save generated content to library</p>
              </div>
              <Switch checked={autoSaveToLibrary} onCheckedChange={setAutoSaveToLibrary} />
            </div>
            <Button className="w-full">Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage how you receive updates and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Generation Complete</Label>
                <p className="text-xs text-muted-foreground">Notify when content generation finishes</p>
              </div>
              <Switch checked={generationComplete} onCheckedChange={setGenerationComplete} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-xs text-muted-foreground">Receive weekly performance summaries</p>
              </div>
              <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Product Updates</Label>
                <p className="text-xs text-muted-foreground">Get notified about new features</p>
              </div>
              <Switch checked={productUpdates} onCheckedChange={setProductUpdates} />
            </div>
            <Button className="w-full">Save Notification Settings</Button>
          </CardContent>
        </Card>

        {/* Content Preferences */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <CardTitle>Content Preferences</CardTitle>
            </div>
            <CardDescription>Configure default content settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {["instagram", "facebook", "twitter", "linkedin", "tiktok"].map((platform) => (
                  <Button
                    key={platform}
                    variant={defaultPlatforms.includes(platform) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Watermark on Exports</Label>
                <p className="text-xs text-muted-foreground">Add watermark to exported content</p>
              </div>
              <Switch checked={watermarkEnabled} onCheckedChange={setWatermarkEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Metadata</Label>
                <p className="text-xs text-muted-foreground">Include generation metadata in files</p>
              </div>
              <Switch checked={metadataIncluded} onCheckedChange={setMetadataIncluded} />
            </div>
            <Button className="w-full">Save Content Settings</Button>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
            <CardDescription>Manage your account security and data privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>
            <div className="space-y-2">
              <Label>Data Retention Period</Label>
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics Tracking</Label>
                <p className="text-xs text-muted-foreground">Help improve Disoriti with usage data</p>
              </div>
              <Switch checked={analyticsTracking} onCheckedChange={setAnalyticsTracking} />
            </div>
            <Button className="w-full">Save Security Settings</Button>
          </CardContent>
        </Card>

        {/* Export Settings */}
        <Card className="shadow-lg rounded-xl border border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              <CardTitle>Export Settings</CardTitle>
            </div>
            <CardDescription>Configure default export options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map((format) => (
                    <SelectItem key={format} value={format}>{format}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Export Quality</Label>
              <Select value={exportQuality} onValueChange={setExportQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qualityLevels.map((quality) => (
                    <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Metadata in Exports</Label>
                <p className="text-xs text-muted-foreground">Embed generation metadata in exported files</p>
              </div>
              <Switch checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
            </div>
            <Button className="w-full">Save Export Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
