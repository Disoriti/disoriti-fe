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
}

export interface ElementData {
  bbox: { x: number; y: number; width: number; height: number };
  styling: Styling;
  text_content: string;
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

const AdLayoutSVG: React.FC<AdLayoutSVGProps> = ({ imageUrl, layout, width = 1080, height = 1080, selected, onSelectElement, onElementsChange, pointerEventsNone, style }) => {
  const [elements, setElements] = useState(layout.elements);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setElements(layout.elements);
  }, [layout]);

  const handleDragStart = (type: ElementType, e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = elements[type].bbox.x;
    const initialY = elements[type].bbox.y;

    onSelectElement?.(type);

    const onDragMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const newElements = {
        ...elements,
        [type]: {
          ...elements[type],
          bbox: { ...elements[type].bbox, x: initialX + dx, y: initialY + dy },
        },
      };
      setElements(newElements);
      onElementsChange?.(newElements);
    };

    const onDragEnd = () => {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
    };

    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
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

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", pointerEvents: pointerEventsNone ? "none" : "auto", ...style }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 1080 1080"
        style={{ background: "#fff" }}
      >
        <image href={imageUrl} width="1080" height="1080" preserveAspectRatio="xMidYMid slice" />
        {(["heading", "subheading", "cta"] as ElementType[]).map((type) => {
          const el = elements[type];
          const isSelected = type === selected;
          return (
            <g key={type}>
              <foreignObject
                x={el.bbox.x}
                y={el.bbox.y}
                width={el.bbox.width}
                height={el.bbox.height}
                onMouseDown={(e) => handleDragStart(type, e)}
                style={{ cursor: "move" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: el.styling.text_align,
                    fontSize: el.styling.font_size,
                    fontWeight: el.styling.font_weight,
                    color: hexToRgba(el.styling.color, el.styling.color_opacity),
                    fontFamily: el.styling.font_family || "Arial",
                    textAlign: el.styling.text_align,
                    backgroundColor: hexToRgba(el.styling.background_color, el.styling.background_opacity),
                    borderRadius: 8,
                    padding: 5,
                    overflow: "hidden",
                    wordBreak: "break-word",
                    userSelect: "none",
                    outline: isSelected ? '2px dashed #007bff' : 'none',
                    outlineOffset: '-2px',
                    letterSpacing: `${el.styling.letter_spacing || 0}px`,
                    textTransform: el.styling.text_transform || 'none',
                  }}
                  onMouseDown={(e) => handleDivDragStart(type, e)}
                >
                  {el.text_content}
                </div>
              </foreignObject>
              {isSelected && (
                <rect
                  x={el.bbox.x + el.bbox.width - 8}
                  y={el.bbox.y + el.bbox.height - 8}
                  width="16"
                  height="16"
                  fill="#007bff"
                  stroke="#fff"
                  strokeWidth="2"
                  cursor="nwse-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleResizeStart(type, e);
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
      {/* Controls are now rendered by the parent */}
    </div>
  );
};

export default AdLayoutSVG; 