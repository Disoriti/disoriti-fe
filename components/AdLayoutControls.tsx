"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Palette, Type, Maximize, Frame, AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline, Image as ImageIcon, Sun, SlidersHorizontal, Settings, BadgeCheck } from "lucide-react";
import type { ElementData, Styling } from "./AdLayoutSVG";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const fonts = ["Arial", "Georgia", "Impact", "Verdana", "Tahoma", "Times New Roman"];

// Image Drop Zone Component
const ImageDropZone = ({ onImageSelect }: { onImageSelect?: (file: File) => void }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect?.(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer group ${
          isDragOver 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className={`p-3 rounded-full transition-colors ${
            isDragOver ? 'bg-primary/10' : 'bg-muted'
          }`}>
            <ImageIcon className={`w-6 h-6 transition-colors ${
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            }`} />
          </div>
          
          <div className="space-y-1">
            <p className={`text-sm font-medium transition-colors ${
              isDragOver ? 'text-primary' : 'text-foreground'
            }`}>
              {isDragOver ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded border"
              />
              <p className="text-xs text-muted-foreground">Image selected</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Alternative upload button */}
      <div className="flex items-center gap-2">
        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setPreviewUrl(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-destructive hover:text-destructive"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};
type ElementType = "heading" | "subheading" | "cta";

const ColorInput = ({ label, value, opacity, onColorChange, onOpacityChange, icon: Icon }: { label: string, value: string, opacity: number, onColorChange: (val: string) => void, onOpacityChange: (val: number) => void, icon: React.ElementType }) => {
  const [sliderValue, setSliderValue] = useState(100);

  // Update slider value when opacity prop changes
  useEffect(() => {
    setSliderValue(opacity * 100);
  }, [opacity]);

  return (
    <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon className="w-4 h-4" /> {label}
        </Label>
        <div className="relative flex items-center">
            <Input
                type="text"
                value={value}
                onChange={(e) => onColorChange(e.target.value)}
                className="pr-10"
            />
            <div className="absolute right-0 mr-1 p-1 rounded-full hover:bg-muted">
                <Input
                    type="color"
                    value={value}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-6 h-6 cursor-pointer opacity-0"
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                />
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: value }} />
            </div>
        </div>
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <span className="text-xs font-mono text-muted-foreground">{Math.round(sliderValue)}%</span>
          </div>
          <Slider
            value={[sliderValue]}
            onValueChange={(vals) => setSliderValue(vals[0])}
            onValueCommit={(vals) => onOpacityChange(vals[0] / 100)}
            max={100}
            step={1}
          />
        </div>
    </div>
  );
}

interface AdLayoutControlsProps {
  elements: {
    heading: ElementData;
    subheading: ElementData;
    cta: ElementData;
  };
  selected: ElementType | null;
  onStyleChange: (type: ElementType, key: keyof Styling, value: string | number) => void;
  onImageEdit?: (edits: { brightness: number; contrast: number; saturation: number }) => void;
  onImageReplace?: (file: File) => void;
  onLogoPositionChange?: (pos: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => void;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onLogoColorChange?: (color: string) => void;
  logoColor?: string;
  onLogoReplace?: (file: File) => void;
  logoImage?: string | null;
  selectedLogo?: boolean;
  onLogoSelect?: (selected: boolean) => void;
  showGrid?: boolean;
  onShowGridChange?: (show: boolean) => void;
}

const AdLayoutControls: React.FC<AdLayoutControlsProps> = ({ elements, selected, onStyleChange, onImageEdit, onImageReplace, onLogoPositionChange, logoPosition, onLogoColorChange, logoColor, onLogoReplace, logoImage, selectedLogo, onLogoSelect, showGrid, onShowGridChange }) => {
  const [imageEdits, setImageEdits] = useState({ brightness: 100, contrast: 100, saturation: 100 });

  // Call onImageEdit when imageEdits changes
  useEffect(() => {
    onImageEdit?.(imageEdits);
  }, [imageEdits]);

  if (!selected && !selectedLogo) return (
    <>
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-xl">
          <CardTitle className="text-lg font-semibold">Edit Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-muted-foreground py-6">
              <p>Select an element or logo on the ad to edit its properties.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Tips Section */}
      <Card className="w-full mt-4 border-primary/40">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-xl">
          <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
            <span role="img" aria-label="lightbulb">💡</span> Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-transparent p-4">
          <ul className="list-none pl-0 space-y-2 text-base">
            <li className="flex items-center gap-2 text-primary font-medium">
              <span role="img" aria-label="editor">📝</span> This is the editor page
            </li>
            <li className="flex items-center gap-2 text-primary font-medium">
              <span role="img" aria-label="lock">🔒</span> You may choose the layout only once
            </li>
            <li className="flex items-center gap-2 text-primary font-medium">
              <span role="img" aria-label="library">📚</span> After that, the image will be edited from the library
            </li>
            <li className="flex items-center gap-2 text-primary font-medium">
              <span role="img" aria-label="sliders">🎚️</span> Use the controls to adjust text, colors, and more
            </li>
            <li className="flex items-center gap-2 text-primary font-medium">
              <span role="img" aria-label="pointer">👆</span> Click on elements to edit their properties
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  );

  // Show logo controls when logo is selected
  if (selectedLogo && !selected) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BadgeCheck className="w-5 h-5" />
              Logo Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Logo Color</Label>
              <input
                type="color"
                value={logoColor || "#ffffff"}
                onChange={e => onLogoColorChange?.(e.target.value)}
                className="w-8 h-8 rounded border border-border bg-background cursor-pointer"
                style={{ padding: 0 }}
              />
            </div>
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-2"><ImageIcon className="w-4 h-4" /> Change Logo</Label>
              <div className="flex items-center gap-3 mt-2">
                <label className="inline-flex items-center px-3 py-2 bg-primary text-primary-foreground rounded cursor-pointer hover:bg-primary/90 transition-colors">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { if (e.target.files?.[0]) onLogoReplace?.(e.target.files[0]); }}
                  />
                </label>
                {logoImage && (
                  <img src={logoImage} alt="Logo preview" className="w-10 h-10 object-contain border rounded bg-white" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show element controls when an element is selected
  if (selected) {
    const selectedStyling = {
      ...elements[selected].styling,
      text_align: elements[selected].styling.text_align || 'left',
    };
    const defaultBgOpacity = selected === 'cta' ? 1 : 0;

    return (
      <div>
        <h3 className="font-semibold text-lg capitalize text-foreground mb-4">Edit {selected}</h3>
        {/* Controls Accordion */}
        <Accordion type="single" collapsible className="w-full" defaultValue="image">
          <AccordionItem value="image">
            <AccordionTrigger className="text-base flex items-center gap-2 pl-2"><SlidersHorizontal className="w-4 h-4" />Image Adjustments</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Sun className="w-4 h-4" /> Brightness</Label>
                <Slider
                  value={[imageEdits.brightness]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={([val]) => {
                    setImageEdits((prev) => ({ ...prev, brightness: val }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Sun className="w-4 h-4 rotate-45" /> Contrast</Label>
                <Slider
                  value={[imageEdits.contrast]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={([val]) => {
                    setImageEdits((prev) => ({ ...prev, contrast: val }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Palette className="w-4 h-4" /> Saturation</Label>
                <Slider
                  value={[imageEdits.saturation]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={([val]) => {
                    setImageEdits((prev) => ({ ...prev, saturation: val }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><ImageIcon className="w-4 h-4" /> Replace Image</Label>
                <ImageDropZone onImageSelect={onImageReplace} />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="color">
            <AccordionTrigger className="text-base flex items-center gap-2 pl-2"><Palette className="w-4 h-4" />Color</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <ColorInput 
                label="Text" 
                value={selectedStyling?.color || ""}
                opacity={selectedStyling?.color_opacity ?? 1}
                onColorChange={(val) => onStyleChange(selected, "color", val)}
                onOpacityChange={(val) => onStyleChange(selected, "color_opacity", val)}
                icon={Palette} 
              />
              <ColorInput 
                label="Background" 
                value={selectedStyling?.background_color || ""}
                opacity={selectedStyling?.background_opacity ?? defaultBgOpacity}
                onColorChange={(val) => onStyleChange(selected, "background_color", val)}
                onOpacityChange={(val) => onStyleChange(selected, "background_opacity", val)}
                icon={Frame} 
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="typography">
            <AccordionTrigger className="text-base flex items-center gap-2 pl-2"><Type className="w-4 h-4" />Typography</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Type className="w-4 h-4" /> Font Family</Label>
                <Select
                  value={selectedStyling?.font_family || "Arial"}
                  onValueChange={(val: string) => onStyleChange(selected, "font_family", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Bold className="w-4 h-4" /> Font Weight</Label>
                <Select
                  value={selectedStyling?.font_weight}
                  onValueChange={(val: string) => onStyleChange(selected, "font_weight", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="lighter">Lighter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Maximize className="w-4 h-4" /> Font Size</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onStyleChange(selected, "font_size", Math.max(8, selectedStyling?.font_size - 1 || 8))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min={8}
                    max={200}
                    value={selectedStyling?.font_size || 8}
                    onChange={(e) => onStyleChange(selected, "font_size", Number(e.target.value))}
                    className="w-full text-center no-spinner"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onStyleChange(selected, "font_size", Math.min(200, selectedStyling?.font_size + 1 || 200))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="formatting">
            <AccordionTrigger className="text-base flex items-center gap-2 pl-2"><Settings className="w-4 h-4" />Formatting</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Text Align</Label>
                <div className="flex gap-1 rounded-md bg-muted p-1">
                  <Button
                    className={`flex-1 ${selectedStyling?.text_align === 'left' ? 'bg-green-600 text-white' : ''}`}
                    variant={selectedStyling?.text_align === 'left' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => onStyleChange(selected, 'text_align', 'left')}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    className={`flex-1 ${selectedStyling?.text_align === 'center' ? 'bg-green-600 text-white' : ''}`}
                    variant={selectedStyling?.text_align === 'center' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => onStyleChange(selected, 'text_align', 'center')}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    className={`flex-1 ${selectedStyling?.text_align === 'right' ? 'bg-green-600 text-white' : ''}`}
                    variant={selectedStyling?.text_align === 'right' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => onStyleChange(selected, 'text_align', 'right')}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Letter Spacing</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onStyleChange(selected, "letter_spacing", Math.max(0, (selectedStyling?.letter_spacing || 0) - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={selectedStyling?.letter_spacing || 0}
                    onChange={(e) => onStyleChange(selected, "letter_spacing", Number(e.target.value))}
                    className="w-full text-center no-spinner"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onStyleChange(selected, "letter_spacing", (selectedStyling?.letter_spacing || 0) + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Text Transform</Label>
                <Select
                  value={selectedStyling?.text_transform || 'none'}
                  onValueChange={(val: string) => onStyleChange(selected, 'text_transform', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Transform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="uppercase">Uppercase</SelectItem>
                    <SelectItem value="lowercase">Lowercase</SelectItem>
                    <SelectItem value="capitalize">Capitalize</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Line Height</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onStyleChange(selected, "line_height", Math.max(0.8, (selectedStyling?.line_height || 1.2) - 0.1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    step="0.05"
                    min="0.8"
                    max="3"
                    value={((selectedStyling?.line_height || 1.2).toFixed(1))}
                    onChange={(e) => onStyleChange(selected, "line_height", Number(Number(e.target.value).toFixed(1)))}
                    className="w-full text-center no-spinner"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onStyleChange(selected, "line_height", Math.min(3, (selectedStyling?.line_height || 1.2) + 0.1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  // Default return (should not reach here)
  return null;
};

export default AdLayoutControls; 