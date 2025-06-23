"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Palette, Type, Maximize, Frame, AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline, Image as ImageIcon, Sun, SlidersHorizontal, Settings } from "lucide-react";
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
type ElementType = "heading" | "subheading" | "cta";

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
}

const AdLayoutControls: React.FC<AdLayoutControlsProps> = ({ elements, selected, onStyleChange, onImageEdit, onImageReplace }) => {
  if (!selected) return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Edit Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10">
          <p>Select an element on the ad to edit its properties.</p>
        </div>
      </CardContent>
    </Card>
  );

  const selectedStyling = elements[selected].styling;

  const [imageEdits, setImageEdits] = useState({ brightness: 100, contrast: 100, saturation: 100 });

  const ColorInput = ({ label, value, opacity, onColorChange, onOpacityChange, icon: Icon }: { label: string, value: string, opacity: number, onColorChange: (val: string) => void, onOpacityChange: (val: number) => void, icon: React.ElementType }) => {
    const [sliderValue, setSliderValue] = useState(opacity * 100);

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
                  setImageEdits((prev) => { const next = { ...prev, brightness: val }; onImageEdit?.(next); return next; });
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
                  setImageEdits((prev) => { const next = { ...prev, contrast: val }; onImageEdit?.(next); return next; });
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
                  setImageEdits((prev) => { const next = { ...prev, saturation: val }; onImageEdit?.(next); return next; });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><ImageIcon className="w-4 h-4" /> Replace Image</Label>
              <Input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) onImageReplace?.(e.target.files[0]); }} />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="color">
          <AccordionTrigger className="text-base flex items-center gap-2 pl-2"><Palette className="w-4 h-4" />Color</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <ColorInput 
              label="Text" 
              value={selectedStyling.color}
              opacity={selectedStyling.color_opacity ?? 1}
              onColorChange={(val) => onStyleChange(selected, "color", val)}
              onOpacityChange={(val) => onStyleChange(selected, "color_opacity", val)}
              icon={Palette} 
            />
            <ColorInput 
              label="Background" 
              value={selectedStyling.background_color}
              opacity={selectedStyling.background_opacity ?? 1}
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
                value={selectedStyling.font_family || "Arial"}
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
                value={selectedStyling.font_weight}
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
                  onClick={() => onStyleChange(selected, "font_size", Math.max(8, selectedStyling.font_size - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min={8}
                  max={200}
                  value={selectedStyling.font_size}
                  onChange={(e) => onStyleChange(selected, "font_size", Number(e.target.value))}
                  className="w-full text-center no-spinner"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onStyleChange(selected, "font_size", Math.min(200, selectedStyling.font_size + 1))}
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
                <Button className="flex-1" variant={selectedStyling.text_align === 'left' ? 'secondary' : 'ghost'} size="icon" onClick={() => onStyleChange(selected, 'text_align', 'left')}><AlignLeft className="w-4 h-4" /></Button>
                <Button className="flex-1" variant={selectedStyling.text_align === 'center' ? 'secondary' : 'ghost'} size="icon" onClick={() => onStyleChange(selected, 'text_align', 'center')}><AlignCenter className="w-4 h-4" /></Button>
                <Button className="flex-1" variant={selectedStyling.text_align === 'right' ? 'secondary' : 'ghost'} size="icon" onClick={() => onStyleChange(selected, 'text_align', 'right')}><AlignRight className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Letter Spacing</Label>
              <Input
                type="number"
                value={selectedStyling.letter_spacing || 0}
                onChange={(e) => onStyleChange(selected, "letter_spacing", Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Text Transform</Label>
              <Select
                value={selectedStyling.text_transform || 'none'}
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AdLayoutControls; 