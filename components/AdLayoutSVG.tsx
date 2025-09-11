"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Palette, Type, Maximize, Frame } from "lucide-react";
import AdLayoutControls from "@/components/AdLayoutControls";

const fonts = ["Arial", "Georgia", "Impact", "Verdana", "Tahoma", "Times New Roman"];
type ElementType = "heading" | "subheading" | "cta";

interface AdLayoutSVGProps {
  imageUrl: string;
  layout: Layout;
  width?: number;
  height?: number;
  selected: ElementType | null;
  onSelectElement?: (type: ElementType | null) => void;
  onElementsChange?: (elements: { heading: ElementData; subheading: ElementData; cta: ElementData }) => void;
  pointerEventsNone?: boolean;
  style?: React.CSSProperties;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  logoColor?: string;
  showLogo?: boolean;
  filter?: string;
  logoImage?: string | null;
  logoBbox?: { x: number; y: number; width: number; height: number };
  onLogoBboxChange?: (bbox: { x: number; y: number; width: number; height: number }) => void;
  selectedLogo?: boolean;
  onLogoSelect?: (selected: boolean) => void;
}

const svgWidth = 1080;
const svgHeight = 1080;

// Define types locally
export interface Styling {
  font_size: number;
  font_weight: string;
  text_align: "left" | "center" | "right";
  color: string;
  background_color: string;
  margin: number;
  font_family?: string;
  color_opacity?: number;
  background_opacity?: number;
  letter_spacing?: number;
  text_transform?: "none" | "uppercase" | "lowercase" | "capitalize";
  line_height?: number;
}

export interface ElementData {
  bbox: { x: number; y: number; width: number; height: number };
  styling: Styling;
  text_content: string;
  hidden?: boolean;
}

export interface Layout {
  id: string;
  style: string;
  elements: {
    heading: ElementData;
    subheading: ElementData;
    cta: ElementData;
  };
}

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const AdLayoutSVG: React.FC<AdLayoutSVGProps> = ({ imageUrl, layout, width = 1080, height = 1080, selected, onSelectElement, onElementsChange, pointerEventsNone, style, logoPosition = 'top-left', logoColor, showLogo = true, filter, logoImage, logoBbox, onLogoBboxChange, selectedLogo, onLogoSelect }) => {
  const [elements, setElements] = useState(layout.elements);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const logoPos = logoPosition;
  const [editingType, setEditingType] = useState<ElementType | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  useEffect(() => {
    setElements(layout.elements);
  }, [layout]);

  const handleDragStart = (type: ElementType, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    document.body.style.userSelect = 'none';
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = layout.elements[type].bbox.x;
    const initialY = layout.elements[type].bbox.y;
    onSelectElement?.(type);
    const onDragMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const newElements = {
        ...layout.elements,
        [type]: {
          ...layout.elements[type],
          bbox: {
            ...layout.elements[type].bbox,
            x: initialX + dx,
            y: initialY + dy,
          },
        },
      };
      onElementsChange?.(newElements);
    };
    const onDragEnd = () => {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  };

  // Add a new handler for div drag
  const handleDivDragStart = (type: ElementType, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dragOffset.current = {
      x: e.clientX - elements[type].bbox.x,
      y: e.clientY - elements[type].bbox.y,
    };
    onSelectElement?.(type);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    function onDragMove(ev: MouseEvent) {
      setElements((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          bbox: {
            ...prev[type].bbox,
            x: ev.clientX - dragOffset.current.x,
            y: ev.clientY - dragOffset.current.y,
          },
        },
      }));
    }
    function onDragEnd() {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
    }
  };

  // Resize handlers
  const handleResizeStart = (type: ElementType, e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    e.stopPropagation();
    onSelectElement?.(type);
    dragOffset.current = {
      x: e.clientX - (elements[type].bbox.x + elements[type].bbox.width),
      y: e.clientY - (elements[type].bbox.y + elements[type].bbox.height),
    };
    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", onResizeEnd);
    function onResizeMove(ev: MouseEvent) {
      setElements((prev) => {
        const newWidth = Math.max(24, ev.clientX - prev[type].bbox.x - dragOffset.current.x);
        const newHeight = Math.max(24, ev.clientY - prev[type].bbox.y - dragOffset.current.y);
        return {
          ...prev,
          [type]: {
            ...prev[type],
            bbox: {
              ...prev[type].bbox,
              width: newWidth,
              height: newHeight,
            },
          },
        };
      });
    }
    function onResizeEnd() {
      window.removeEventListener("mousemove", onResizeMove);
      window.removeEventListener("mouseup", onResizeEnd);
    }
  };

  // Style change handler
  const handleStyleChange = (type: ElementType, key: keyof Styling, value: any) => {
    // This logic now needs to be in the parent, ContentPage
    // For now, we pass a dummy function to AdLayoutControls
  };

  // Logo drag handler
  const handleLogoDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    document.body.style.userSelect = 'none';
    onLogoSelect?.(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = logoBbox?.x || 24;
    const initialY = logoBbox?.y || 24;
    
    const onDragMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startX) * (1080 / width);
      const dy = (ev.clientY - startY) * (1080 / height);
      const currentBbox = logoBbox || { x: 24, y: 24, width: 80, height: 80 };
      const newBbox = {
        ...currentBbox,
        x: Math.max(0, Math.min(1080 - currentBbox.width, initialX + dx)),
        y: Math.max(0, Math.min(1080 - currentBbox.height, initialY + dy)),
      };
      onLogoBboxChange?.(newBbox);
    };
    
    const onDragEnd = () => {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      document.body.style.userSelect = '';
    };
    
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  };

  // Logo resize handler
  const handleLogoResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onLogoSelect?.(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = logoBbox?.width || 80;
    const initialHeight = logoBbox?.height || 80;
    const initialX = logoBbox?.x || 24;
    const initialY = logoBbox?.y || 24;
    
    const onResizeMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startX) * (1080 / width);
      const dy = (ev.clientY - startY) * (1080 / height);
      const newWidth = Math.max(20, Math.min(300, initialWidth + dx));
      const newHeight = Math.max(20, Math.min(300, initialHeight + dy));
      
      // Ensure logo doesn't go outside bounds
      const maxX = 1080 - newWidth;
      const maxY = 1080 - newHeight;
      const newX = Math.max(0, Math.min(maxX, initialX));
      const newY = Math.max(0, Math.min(maxY, initialY));
      
      const newBbox = {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      };
      onLogoBboxChange?.(newBbox);
    };
    
    const onResizeEnd = () => {
      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', onResizeEnd);
    };
    
    window.addEventListener('mousemove', onResizeMove);
    window.addEventListener('mouseup', onResizeEnd);
  };

  // Helper to measure text size in SVG
  const measureText = (text: string, fontSize: number, fontWeight: string, fontFamily: string) => {
    if (typeof window === "undefined") return { width: 0, height: 0 };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const tempText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tempText.setAttribute("font-size", fontSize.toString());
    tempText.setAttribute("font-weight", fontWeight);
    tempText.setAttribute("font-family", fontFamily);
    tempText.textContent = text;
    svg.appendChild(tempText);
    document.body.appendChild(svg);
    const bbox = tempText.getBBox();
    document.body.removeChild(svg);
    return { width: bbox.width, height: bbox.height };
  };

  // Font scaling factor: scale font size by crop area, not by final display size
  const fontScale = Math.min(svgWidth, svgHeight) / 1080;

  // Logo position styles
  const logoStyles: Record<string, React.CSSProperties> = {
    'top-left': { left: 24, top: 24, right: 'auto', bottom: 'auto', position: 'absolute' },
    'top-right': { right: 24, top: 24, left: 'auto', bottom: 'auto', position: 'absolute' },
    'bottom-left': { left: 24, bottom: 24, right: 'auto', top: 'auto', position: 'absolute' },
    'bottom-right': { right: 24, bottom: 24, left: 'auto', top: 'auto', position: 'absolute' },
  };

  return (
    <div style={{ position: 'relative', width, height, ...style, cursor: pointerEventsNone ? 'pointer' : undefined }}>
      <img src={imageUrl} width={width} height={height} style={{ width, height, objectFit: 'cover', borderRadius: 12, filter }} alt="ad background" />
      {/* Transparent overlay for deselection */}
      <div
        style={{ position: 'absolute', left: 0, top: 0, width, height, zIndex: 1, cursor: 'default', background: 'transparent' }}
        onClick={() => {
          onSelectElement?.(null);
          onLogoSelect?.(false);
        }}
      />
      {(['heading', 'subheading', 'cta'] as ElementType[]).map((type) => {
        const el = layout.elements[type];
        if (el?.hidden) return null;
        const isSelected = type === selected;
        const bgOpacity = type === 'cta' ? (el.styling.background_opacity ?? 1) : (el.styling.background_opacity ?? 0);
        return (
          <div
            key={type}
            style={{
              position: 'absolute',
              left: el.bbox.x * (width / 1080),
              top: el.bbox.y * (height / 1080),
              minWidth: 40,
              maxWidth: width,
              minHeight: 24,
              maxHeight: height,
              width: el.bbox.width * (width / 1080),
              height: el.bbox.height * (height / 1080),
              padding: '8px 16px',
              paddingTop: 10,
              paddingRight: 28,
              fontSize: el.styling.font_size * (width / 1080),
              fontWeight: el.styling.font_weight,
              color: el.styling.color,
              fontFamily: el.styling.font_family || 'Montserrat, Poppins, Lato, Arial',
              textAlign: el.styling.text_align,
              background: hexToRgba(el.styling.background_color, bgOpacity),
              borderRadius: type === 'cta' ? 8 : 0,
              boxShadow: type === 'cta' ? '0 2px 8px rgba(0,0,0,0.12)' : undefined,
              letterSpacing: `${el.styling.letter_spacing || 0}px`,
              textTransform: el.styling.text_transform || 'none',
              lineHeight: el.styling.line_height || 1.2,
              whiteSpace: 'pre-line',
              overflowWrap: 'break-word',
              pointerEvents: pointerEventsNone ? 'none' : 'auto',
              outline: isSelected ? '2px dashed #00FFA9' : 'none',
              outlineOffset: '-2px',
              cursor: pointerEventsNone ? 'default' : 'move',
              zIndex: isSelected ? 2 : 1,
              resize: 'none',
              boxSizing: 'border-box',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: el.styling.text_align,
            }}
            onMouseDown={pointerEventsNone ? undefined : (e) => handleDragStart(type, e)}
            onClick={pointerEventsNone ? undefined : (e) => { e.stopPropagation(); onSelectElement?.(type); }}
            onDoubleClick={pointerEventsNone ? undefined : () => {
              if (selected === type) {
                setEditingType(type);
                setEditingValue(el.text_content);
              }
            }}
          >
            {!pointerEventsNone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newElements = {
                    ...layout.elements,
                    [type]: {
                      ...el,
                      hidden: true,
                    },
                  };
                  onElementsChange?.(newElements);
                }}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12,
                  lineHeight: '22px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  zIndex: 11,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}
                aria-label={`Remove ${type}`}
                title={`Remove ${type}`}
              >
                ×
              </button>
            )}
            {editingType === type ? (
              <textarea
                autoFocus
                value={editingValue}
                onChange={e => setEditingValue(e.target.value)}
                onBlur={() => {
                  setEditingType(null);
                  if (editingValue !== el.text_content) {
                    const newElements = {
                      ...layout.elements,
                      [type]: {
                        ...el,
                        text_content: editingValue,
                      },
                    };
                    onElementsChange?.(newElements);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    (e.target as HTMLTextAreaElement).blur();
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                  color: el.styling.color,
                  fontFamily: el.styling.font_family || 'Montserrat, Poppins, Lato, Arial',
                  fontWeight: el.styling.font_weight,
                  fontSize: el.styling.font_size * (width / 1080),
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  textAlign: el.styling.text_align,
                  letterSpacing: `${el.styling.letter_spacing || 0}px`,
                  textTransform: el.styling.text_transform || 'none',
                  padding: 0,
                  margin: 0,
                  overflow: 'hidden',
                }}
              />
            ) : (
              el.text_content
            )}
            {isSelected && !pointerEventsNone && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: 16,
                  height: 16,
                  background: '#00FFA9',
                  borderRadius: 4,
                  cursor: 'nwse-resize',
                  zIndex: 10,
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const initialW = el.bbox.width;
                  const initialH = el.bbox.height;
                  const onResize = (ev: MouseEvent) => {
                    const dx = (ev.clientX - startX) * (1080 / width);
                    const dy = (ev.clientY - startY) * (1080 / height);
                    const newElements = {
                      ...layout.elements,
                      [type]: {
                        ...el,
                        bbox: {
                          ...el.bbox,
                          width: Math.max(40, initialW + dx),
                          height: Math.max(24, initialH + dy),
                        },
                      },
                    };
                    onElementsChange?.(newElements);
                  };
                  const onResizeEnd = () => {
                    window.removeEventListener('mousemove', onResize);
                    window.removeEventListener('mouseup', onResizeEnd);
                  };
                  window.addEventListener('mousemove', onResize);
                  window.addEventListener('mouseup', onResizeEnd);
                }}
              />
            )}
          </div>
        );
      })}
      {/* Logo */}
      {showLogo !== false && (
        <div
          style={{
            position: 'absolute',
            left: (logoBbox?.x || 24) * (width / 1080),
            top: (logoBbox?.y || 24) * (height / 1080),
            width: (logoBbox?.width || 80) * (width / 1080),
            height: (logoBbox?.height || 80) * (height / 1080),
            pointerEvents: pointerEventsNone ? 'none' : 'auto',
            outline: selectedLogo && !pointerEventsNone ? '2px dashed #00FFA9' : 'none',
            outlineOffset: '-2px',
            cursor: pointerEventsNone ? 'default' : 'move',
            zIndex: selectedLogo ? 2 : 1,
          }}
          onMouseDown={pointerEventsNone ? undefined : handleLogoDragStart}
          onClick={pointerEventsNone ? undefined : (e) => { e.stopPropagation(); onLogoSelect?.(true); }}
        >
          {logoImage ? (
            <img
              src={logoImage}
              alt="Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                background: 'transparent',
              }}
            />
          ) : null}
          {selectedLogo && !pointerEventsNone && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: 16,
                height: 16,
                background: '#00FFA9',
                borderRadius: 4,
                cursor: 'nwse-resize',
                zIndex: 10,
              }}
              onMouseDown={e => {
                e.stopPropagation();
                handleLogoResizeStart(e);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdLayoutSVG; 